using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data.Common;
using System;
using System.Data.Entity;
using System.Data.Entity.Core.EntityClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using FinancialForecast.MVC.Data;
using Microsoft.EntityFrameworkCore;
using FinancialForecast.MVC.Models;

namespace FinancialForecast.MVC
{
    public class ForecastDB
    {
        public static String SiteName
        {
            get
            {
                return "EntityFramework";
            }
        }

        public readonly IConfiguration _configuration;
        private const String EfDatabaseNamePostfix = @".FinancialForecastDbContext";
        private const String EfMetaData = @"res://*/FinancialForecastDbContext.csdl|res://*/FinancialForecastDbContext.ssdl|res://*/FinancialForecastDbContext.msl";
        private const String EfProviderName = "System.Data.SqlClient";

        private readonly DbConnection _FinancialForecastDbConnection;
        private FinancialForecastDBContext _FinancialForecastDbContext;
        public AppIdentityDbContext AppIdentityDbContext;

        /// <summary>Gets or sets the underlying <see cref="System.Data.Common.DbConnection"/> object used to connect to the database.</summary>
        protected DbConnection FinancialForecastDbConnection
        {
            get { return this._FinancialForecastDbConnection; }
        }

        /// <summary>Gets or sets the underlying <see cref="FinancialForecastDbContext"/> object used to query to the database.</summary>
        public virtual FinancialForecastDBContext FinancialForecastDbContext
        {
            get { return this._FinancialForecastDbContext; }
            set { this._FinancialForecastDbContext = value; }
        }

        public ForecastDB()
        {
        //    // Get the name of this site to choose the correct connection string in the web.config to build the connection to the database

        string connectionStringName = String.Concat(SiteName, EfDatabaseNamePostfix);
        IConfigurationBuilder _configurationBuilder = new ConfigurationBuilder();
        _configurationBuilder.AddJsonFile("appsettings.json");
        _configuration = _configurationBuilder.Build();
        var optionBuilder = new DbContextOptionsBuilder<FinancialForecastDBContext>();
        optionBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        this._FinancialForecastDbContext = new FinancialForecastDBContext(optionBuilder.Options);

        var builder = new DbContextOptionsBuilder<AppIdentityDbContext>();
        builder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        this.AppIdentityDbContext = new AppIdentityDbContext(builder.Options);


        }



    }
}
