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

        [AllowAnonymous, HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel registerUser)
        {
            if (ModelState.IsValid)
            {
                if (registerUser.Password.Equals(registerUser.ConfirmPassword))
                {
                    Models.User existingUser = this.FinancialForecastDBContext.Users.Where(x => x.UserName == registerUser.Username).FirstOrDefault();
                                
                    if (existingUser != null)
                    {
                        ModelState.AddModelError(string.Empty, "Username already exists. Please try a different username");
                        return View(registerUser);
                    }

                    var user = new IdentityUser { UserName = registerUser.Username };
                    var result = await UserManager.CreateAsync(user, registerUser.Password);

                    if (result.Succeeded)
                    {
                        Models.User newUser = new User(0, null, null, registerUser.Username, registerUser.Password);

                        await SignInManager.SignInAsync(user, isPersistent: true);

                        this.FinancialForecastDBContext.Users.Add(newUser);
                        this.FinancialForecastDBContext.SaveChanges();


                        //return Convert.ToInt32(newUser.UserID);

                        return RedirectToAction("Index", "Forecast");
                    }


                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
                else
                    ModelState.AddModelError(string.Empty, "Passwords did not match. Please try again");
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
