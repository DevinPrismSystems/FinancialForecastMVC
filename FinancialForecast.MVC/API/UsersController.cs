using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FinancialForecast.MVC.API
{
    public class UsersController : ForecastAPIController
    {
        [HttpGet]
        [Route("api/users/all")]
        public IEnumerable<User> get()
        {            
            return this.db.Set<User>();
        }
    }
}
