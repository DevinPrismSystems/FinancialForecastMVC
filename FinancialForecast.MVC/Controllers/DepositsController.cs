using Microsoft.AspNetCore.Mvc;
using System.Web.Http;

namespace FinancialForecast.MVC.Controllers
{
    [Authorize]
    public class DepositsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
