using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;

namespace FinancialForecast.MVC.API
{
    public class ForecastAPIController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/Withdrawals/all")]
        public IEnumerable<Withdrawal> Get()
        {
            return this.db.Withdrawals.Select(u => new Withdrawal(u)).ToArray().OrderBy(u => u.Date);
        }
    }
}
