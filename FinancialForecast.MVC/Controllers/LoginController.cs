using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace FinancialForecast.MVC.Controllers
{
    public class LoginController : Controller
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;

        public LoginController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            userManager = this.userManager;
            signInManager = this.signInManager;
            //Register();
        }

        public async Task Register()
        {
            var user = new IdentityUser { UserName = "legendary7803" };
            var result = await userManager.CreateAsync(user, "prism");

            if (result.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: false);
                //return RedirectToAction("Index", "Forecast");
            }
        }
    }

}
