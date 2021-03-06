using FinancialForecast.MVC.Data;
using FinancialForecast.MVC.Models;
using System;
using System.Web.Http;
using FinancialForecast.MVC.Controllers;

namespace FinancialForecast.MVC.API
{
    public class FinancialForecastController : ApiController
    {
        public FinancialForecastDBContext db;
        public AppIdentityDbContext AppIdentityDbContext;
        private User user;

        public static string logFolderDateFormat;
        public static string errorLogDateFormat;

        public Int32 CommandTimeout = 60;
        public static String CurrentUserID;

        //public ForecastDB Db { get { return db; } }
        public new User User { get { return user; } }



        private void instantiateDbContext()
        {
            this.db = new ForecastDB().FinancialForecastDbContext;
            this.AppIdentityDbContext = new ForecastDB().AppIdentityDbContext;
            //this.db.Database. = this.CommandTimeout;
        }

        public void RefreshDbContext()
        {
            this.instantiateDbContext();
        }

        public FinancialForecastController() : base()
        {
            //HttpConfiguration config = new HttpConfiguration();
            //config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            //config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            this.instantiateDbContext();
            CurrentUserID = FinancialForecast.MVC.Controllers.FinancialForecastController.CurrentUserID;
        }

        public static void CreateLogFiles()
        {
            //errorLogDateFormat used to create log files format :
            //dd/mm/yyyy hh:mm:ss AM/PM ==> Log Message
            errorLogDateFormat = DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString() + " ==> ";

            //logFolderDateFormat used to create folders for log files
            string Year = DateTime.Now.Year.ToString();
            string Month = DateTime.Now.Month.ToString();
            string Day = DateTime.Now.Day.ToString();

            logFolderDateFormat = Year + Month + Day;
        }
        //public static void logError(string message, string source, string details)
        //{
        //    CreateLogFiles();
        //    string logPath = HttpContext.Current.Server.MapPath("/");
        //    if (!System.IO.Directory.Exists(@logPath + "//PathFinder//logs//")
        //        System.IO.Directory.CreateDirectory(@logPath + "//PathFinder//logs//");

        //    private readonly StreamWriter _logStream = new StreamWriter("mylog.txt", append: true);

        //_logStream.WriteLine(errorLogDateFormat + "message: " + message);
        //        sw.WriteLine(errorLogDateFormat + "source:" + source);
        //        sw.WriteLine(errorLogDateFormat + "AdditionalDetails: " + details);

        //        sw.Flush();
        //        sw.Close();
        //    using (StreamWriter sw = File.AppendText(@logPath + "//PathFinder//logs//" + logFolderDateFormat + ".txt"))
        //    {
        //        //StreamWriter sw = new StreamWriter(logPath + logFolderDateFormat, true);

        //        sw.WriteLine(errorLogDateFormat + "message: " + message);
        //        sw.WriteLine(errorLogDateFormat + "source:" + source);
        //        sw.WriteLine(errorLogDateFormat + "AdditionalDetails: " + details);

        //        sw.Flush();
        //        sw.Close();
        //    }
        //}
    }
}
