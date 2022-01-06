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
using System.Web.Http;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Security.Claims;

namespace FinancialForecast.MVC.Controllers
{
    [Authorize]
    public class FinancialForecastController : Controller
    {
        private FinancialForecastDBContext _FinancialForecastDbContext;
        private AppIdentityDbContext _AppIdentityDbContext;
        public readonly IConfiguration _configuration;
        public Int32 CommandTimeout = 60;
        public Int32 CookieTimeout = 2;
        public static IdentityUser CurrentUser;
        public static String CurrentUserID;

        private readonly ILogger<FinancialForecastController> _logger;

        public UserManager<IdentityUser> UserManager { get; set; }

        public SignInManager<IdentityUser> SignInManager { get; set; }

        public IHttpContextAccessor _httpContextAccessor { get; set; }

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

            this._FinancialForecastDbContext = new ForecastDB().FinancialForecastDbContext;
            this._AppIdentityDbContext = new ForecastDB().AppIdentityDbContext;
            //SetCurrentUser();
        }



        public FinancialForecastController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SetCurrentUser()
        {
            CurrentUser = await UserManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
            CurrentUserID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
  
