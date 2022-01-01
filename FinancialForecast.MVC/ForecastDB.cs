using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data.Common;
using System;
using System.Data.Entity;
using FinancialForecast.MVC.Data;
using System.Data.Entity.Core.EntityClient;

namespace FinancialForecast.MVC
{
    public class ForecastDB
    {
        public String SiteName
        {
            get
            {
                return "EntityFramework";
            }
        }

        public IConfiguration Configuration { get; }

        private const String EfDatabaseNamePostfix = @".FinancialForecastDbContext";
        private const String EfMetaData = @"res://*/FinancialForecastDbContext.csdl|res://*/FinancialForecastDbContext.ssdl|res://*/FinancialForecastDbContext.msl";
        private const String EfProviderName = "System.Data.SqlClient";

        //public FinancialForecastDb()
        //{
        //    // Get the name of this site to choose the correct connection string in the web.config to build the connection to the database

        //    string connectionStringName = String.Concat(this.SiteName, EfDatabaseNamePostfix);
        //    string configConnectionString = Configuration.GetConnectionString("DefaultConnection");            
        //    var connectionStringBuilder = new EntityConnectionStringBuilder();
        //    //var connectionStringBuilder =
        //    //    new EntityConnectionStringBuilder
        //    //    {
        //    //        Provider = EfProviderName,
        //    //        ProviderConnectionString = configConnectionString,
        //    //        Metadata = EfMetaData
        //    //    };
        //    connectionStringBuilder.Provider = EfProviderName;
        //    connectionStringBuilder.ProviderConnectionString = configConnectionString;
        //    connectionStringBuilder.Metadata = EfMetaData;
        //    // Create the connection to the database through the DbContext and grab the connection
        //    this._FinancialForecastDbContext = new FinancialForecastDBContext(connectionStringBuilder.ToString());
        //    //this._FinancialForecastDbConnection = this._FinancialForecastDbContext.Database.connection;

        //}


        private readonly DbConnection _FinancialForecastDbConnection;
        private FinancialForecastDBContext _FinancialForecastDbContext;
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
    }
}
