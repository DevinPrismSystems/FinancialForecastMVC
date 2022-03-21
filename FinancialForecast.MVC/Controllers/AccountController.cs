using FinancialForecast.MVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace FinancialForecast.MVC.Controllers
{
    public class AccountController : FinancialForecastController
    {        
        //public UserManager<IdentityUser> UserManager { get; private set; }

        //private readonly SignInManager<IdentityUser> signInManager;

        //private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IHttpContextAccessor httpContextAccessor)
        {
            SignInManager = signInManager;
            UserManager = signInManager.UserManager;           
            this._httpContextAccessor = httpContextAccessor;


        }

        [HttpGet, AllowAnonymous]
        public IActionResult Register()
        {         
            return View();
        }

        public async Task<IActionResult> Register(LoginViewModel registerUser)
        {
            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = registerUser.UserName };
                var result = await UserManager.CreateAsync(user, registerUser.Password);

                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: true);

                    
                    //this.FinancialForecastDBContext.Users.Add(newUser);
                    //this.db.SaveChanges();
                    //return Convert.ToInt32(newUser.UserID);

                    return RedirectToAction("Index", "Forecast");
                }
               
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            return View(registerUser);            
        }

        [AllowAnonymous, HttpPost]
        public async Task<IActionResult> Login(LoginViewModel login)
        {

            if (ModelState.IsValid)
            {
                var result = await SignInManager.PasswordSignInAsync(login.UserName, login.Password, isPersistent: true, false);

                if (result.Succeeded)
                {
                    await SetCurrentUser();
                    return RedirectToAction("Index", "Forecast");
                }

                string user = this.FinancialForecastDBContext.Users.Where(x => x.UserName == login.Username).Select(x => x.UserName).FirstOrDefault();
                if (string.IsNullOrEmpty(user))
                {
                    ModelState.AddModelError(string.Empty, "Username does not exist");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "The password is incorrect");
                }
            }

            return View(login);
        }

        [HttpGet, AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Logout()
        {
            LogoutUser();
            return RedirectToAction("Login", "Account");
        }

        [HttpPost]
        public async Task LogoutUser()
        {
            await SignInManager.SignOutAsync();            
        }


    }
}
