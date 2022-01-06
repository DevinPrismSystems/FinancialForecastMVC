using Microsoft.AspNetCore.Mvc;
using FinancialForecast.MVC.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Web.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace FinancialForecast.MVC.Controllers
{
    [Authorize]
    public class ForecastController : FinancialForecastController
    {
        public ForecastController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IHttpContextAccessor httpContextAccessor)
        {
            SignInManager = signInManager;
            UserManager = signInManager.UserManager;
            this._httpContextAccessor = httpContextAccessor;


        }

        public async Task<IActionResult> Index()
        {
            await SetCurrentUser();
            if (CurrentUser != null)
            {
                ViewBag.Periods = new SelectList(this.FinancialForecastDBContext.Periods.Where(x => x.UserRefID == CurrentUserID).Select(x => new { Value = x.ID, Text = x.StartDate + " - " + x.EndDate }), "Value", "Text");
                return View();
            }

            return RedirectToAction("Login", "Account");
        }
    }
}
