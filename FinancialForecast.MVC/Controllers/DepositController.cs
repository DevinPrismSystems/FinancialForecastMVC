using Microsoft.AspNetCore.Mvc;
using System.Web.Http;

namespace FinancialForecast.MVC.Controllers
{
    [Authorize]
    public class DepositController : FinancialForecastController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
