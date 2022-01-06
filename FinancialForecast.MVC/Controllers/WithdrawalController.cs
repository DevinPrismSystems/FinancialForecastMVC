using Microsoft.AspNetCore.Mvc;

namespace FinancialForecast.MVC.Controllers
{
    public class WithdrawalController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
