using FinancialForecast.MVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FinancialForecast.MVC.Controllers
{
    public class UsersController : FinancialForecastController
    {
        [AllowAnonymous, HttpPost]

        public ActionResult Login(User login, String returnUrl = "~/")
        {
            ViewBag.ReturnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                if (this.ValidateUserLogin(login.UserName, login.Password))
                {
                    base.LoginValidUser(login.UserName);
                    return this.Redirect(returnUrl);
                }
                else
                {
                    this.ModelState.AddModelError("Invalid Login", "The user name and password are invalid.");
                }
            }

            return this.View(login);
        }

        public ActionResult Index()
        {
            //SelectList SecurityQuestions = new SelectList(this.PathFinderDbContext.UserSecurityQuestions.Select(x => new { Value = x.SecurityQuestionID, Text = x.SecurityQuestion }), "Value", "Text");
            ViewBag.BaseURL = _configuration.GetSection("BaseURL").Value;
            return View();
        }


        // GET: Users

        [AllowAnonymous]
        public ActionResult Logout()
        {
            return base.Logout();
        }
    }
}
