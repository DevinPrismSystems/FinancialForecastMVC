using FinancialForecast.MVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FinancialForecast.MVC.Controllers
{

    public class UsersController : FinancialForecastController
    {
        public ActionResult Index()
        {
            
            //SelectList SecurityQuestions = new SelectList(this.PathFinderDbContext.UserSecurityQuestions.Select(x => new { Value = x.SecurityQuestionID, Text = x.SecurityQuestion }), "Value", "Text");
            ViewBag.BaseURL = _configuration.GetSection("BaseURL").Value;
            return View();
        }
    }
}
