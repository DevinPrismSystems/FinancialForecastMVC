﻿// <auto-generated />
using System;
using FinancialForecast.MVC.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FinancialForecast.MVC.Migrations
{
    [DbContext(typeof(FinancialForecastDBContext))]
    [Migration("20220221175433_UpdateFinancialProfile")]
    partial class UpdateFinancialProfile
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("FinancialForecast.MVC.Models.Deposit", b =>
                {
                    b.Property<int?>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("ID"), 1L, 1);

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<double>("Amount")
                        .HasColumnType("float");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Frequency")
                        .HasColumnType("int");

                    b.Property<DateTime>("StopDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserRefID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isRecurring")
                        .HasColumnType("bit");

                    b.HasKey("ID");

                    b.ToTable("Deposit", (string)null);
                });

            modelBuilder.Entity("FinancialForecast.MVC.Models.FinancialProfile", b =>
                {
                    b.Property<string>("UserRefID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("DateEntered")
                        .HasColumnType("datetime2");

                    b.Property<double>("StartAmount")
                        .HasColumnType("float");

                    b.HasKey("UserRefID");

                    b.ToTable("FinancialProfile", (string)null);
                });

            modelBuilder.Entity("FinancialForecast.MVC.Models.Period", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ID"), 1L, 1);

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<double>("FinalAmount")
                        .HasColumnType("float");

                    b.Property<double>("StartAmount")
                        .HasColumnType("float");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserRefID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.ToTable("Period", (string)null);
                });

            modelBuilder.Entity("FinancialForecast.MVC.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"), 1L, 1);

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserID");

                    b.ToTable("User", (string)null);
                });

            modelBuilder.Entity("FinancialForecast.MVC.Models.Withdrawal", b =>
                {
                    b.Property<int?>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("ID"), 1L, 1);

                    b.Property<bool>("Active")
                        .HasColumnType("bit");

                    b.Property<double>("Amount")
                        .HasColumnType("float");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Frequency")
                        .HasColumnType("int");

                    b.Property<DateTime>("StopDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserRefID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isRecurring")
                        .HasColumnType("bit");

                    b.HasKey("ID");

                    b.ToTable("Withdrawal", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
