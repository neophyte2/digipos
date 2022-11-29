import $ from "jquery"

$(document).ready(() => {

    const input = document.querySelector("#pwd");
  
    $(".shw_p").hide();
    $(".toggle_password").click((e) => {
      if (input.type == "password") {
        input.type = "text";    
        $(".show_password").hide();
        $(".shw_p").show();
      } else {
        input.type = "password";
        $(".show_password").show();
        $(".shw_p").hide();
      } 
    }); 
  
    $(".nav-dropdown").click(function () {
      $(".dropdown-content").toggleClass("dropdown-active");
    });
  
    $(".toogler").click(function () {
      $(".sidebar-overlay").addClass("openTog");
    });
  
    $(".close-icon").click(function () {
      $(".sidebar-overlay").removeClass("openTog");
    });
  
  
    $(".dropdown-network").click(function () {
      $(this).toggleClass("drp_border"); 
      $(".sidebar-dropdown").toggleClass("shw");
    });

    $(".select_ul li").click(function () {
      var currentele = $(this).html();
      $(".default_option li").html(currentele);
    });
    
    $(".select-plan").click(function () {
      $(".package-dropdown").toggleClass("shw");
    });

    $(".select-package").click(function () {
      $(this).addClass("s_package"); 
      $(".package-dropdown").toggleClass("shw");
    });
    $(".package_ul li").click(function () {
      var currentele = $(this).html();
      $(".package_option li").html(currentele);
    });
    $(".select_p").click(function () {  
      $(this).addClass("drp_border");
      $(this).addClass("select-style");
    });
    $(".selectdropdown_ul li").click(function () {
      var currentele = $(this).html();
      $(".default_option_select li").html(currentele);
    });
  
    $(".sidebar-btn").click(() => {
      $(".d-sidebar").addClass("sidebar-show");
      $(".d-sidebar-remove").addClass("sidebar-show");
      setTimeout(() => {
        $(".sidebar-wrap").addClass("sidebar_wrap");
      },1);
    });
    $(".close-sidebar").click((e) => {
      $(".d-sidebar").removeClass("sidebar-show");
      $(".sidebar-wrap").removeClass("sidebar_wrap");
      $(".d-sidebar-remove").removeClass("sidebar-show");
  
    })
    $(".d-sidebar-remove").click(()=>{
      $(".d-sidebar").removeClass("sidebar-show");
      $(".d-sidebar-remove").removeClass("sidebar-show");
    })
  
    $(".country_select").click((e) => {
      $(".country-dropdown").toggleClass("shw");
    }); 
  
    $(".cardless-pos").click((e) => {
      $(".pos-arrow-right").toggleClass("arrow-show");
      $(".cardless-info").toggleClass("show-card");
    });


  }); 
  