using FinancialForecast.MVC.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Web;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Session;
using System.Security.Principal;
using FinancialForecast.MVC.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialForecast.MVC.Controllers
{
    public class FinancialForecastController : Controller
    {
        private FinancialForecastDBContext _FinancialForecastDbContext;
        public readonly IConfiguration _configuration;
        public Int32 CommandTimeout = 60;
        public Int32 CookieTimeout = 2;
        public static User CurrentUser;
        private readonly ILogger<FinancialForecastController> _logger;

        public FinancialForecastController(ILogger<FinancialForecastController> logger)
        {
            _logger = logger;
        }

        public virtual FinancialForecastDBContext FinancialForecastDBContext
        {
            get { return this._FinancialForecastDbContext; }
            set { this._FinancialForecastDbContext = value; }
        }

        public FinancialForecastController()
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("appsettings.json");
            _configuration = configurationBuilder.Build();

            var optionBuilder = new DbContextOptionsBuilder<FinancialForecastDBContext>();
            optionBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
            this._FinancialForecastDbContext = new FinancialForecastDBContext(optionBuilder.Options);
            var user = this._FinancialForecastDbContext.Users.First();
            CurrentUser = new User(user.UserID, user.FirstName, user.LastName, user.UserName, user.Password);
        }




        public FinancialForecastController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected void LoginValidUser(string username)
        {

            // need the cookie timeout            
            int timeout = CookieTimeout;

            // Get the user and their most powerful role. Exclude users that have no roles.
            var theUsers = from u in this._FinancialForecastDbContext.Users
                           select new
                           {
                               UserID = u.UserID,
                               Username = u.UserName,
                               FirstName = u.FirstName,
                               LastName = u.LastName                               
                           };
            CurrentUser = this.FinancialForecastDBContext.Users.Where(u => u.UserName.Equals(username)).First();
            HttpContext.Response.Cookies.Append(CurrentUser.UserName, "2");
            
        }

        protected virtual Boolean ValidateUserLogin(string username, string password)
        {
            int resultCount = this._FinancialForecastDbContext.Users
                .Where(user => user.Password == password
                    && user.UserName == username)
                .Count();
            return resultCount > 0;
        }

        internal ActionResult Logout()
        {
            HttpContext.Session.Clear();
            HttpContext.User = new GenericPrincipal(new GenericIdentity(string.Empty), null);
            return this.RedirectToRoute("Default");
        }
    }
}
