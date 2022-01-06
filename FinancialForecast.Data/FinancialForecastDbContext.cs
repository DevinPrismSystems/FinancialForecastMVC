using System;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;

namespace FinancialForecast.Data
{
    public partial class FinancialForecastDbContext : DbContext
    {
        public FinancialForecastDbContext(String nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }
    }
}
