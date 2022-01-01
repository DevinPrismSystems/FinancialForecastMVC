using Microsoft.AspNetCore.Mvc;

namespace FinancialForecast.MVC.Controllers
{
    public class DepositsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
