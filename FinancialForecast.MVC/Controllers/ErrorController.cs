using Microsoft.AspNetCore.Mvc;

namespace FinancialForecast.MVC.Controllers
{
    public class ErrorController : Controller
    {
        public ViewResult Index()
        {
            return View("~/Views/Shared/Error.cshtml");
        }
        public ViewResult NotFound(int id)
        {
            Response.StatusCode = id;
            return View("~/Views/Shared/NotFound.cshtml");
        }
        public ViewResult Unauthorized()
        {
            //Response.StatusCode = 401; 
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}
