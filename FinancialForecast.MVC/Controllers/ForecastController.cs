using Microsoft.AspNetCore.Mvc;
using FinancialForecast.MVC.Data;
using System.Linq;

namespace FinancialForecast.MVC.Controllers
{
    public class ForecastController : FinancialForecastController
    {
        public IActionResult Index()
        {
            ViewBag.Periods = this.FinancialForecastDBContext.Periods.Where(x => x.UserRefID == CurrentUser.UserID).ToList();
            return View();
        }
    }
}
