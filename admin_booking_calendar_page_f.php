<?php
	include "../Controller/utils.php";	
	
	if (!check_login())
	{
		die("You need to login to use this page." . 'Admin ...');
	}
?>
<html class="no-js" lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

<!--!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" /  -->
	<title>Admin Booking</title>

	<!--script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.1.1.min.js"></script -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<link href="https://www.seekmedi.com/wp-content/themes/zerif-lite/css/bootstrap.css?ver=4.7.4" rel="stylesheet">
	<link href="admin_booking_calendar_page.css" rel="stylesheet">
	
    <link rel="stylesheet" href="../foundation-6.4.1-complete/css/foundation.css">
    <link rel="stylesheet" href="../foundation-6.4.1-complete/css/app.css">

	<link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="table.css">
	<script src="../View/admin_booking_controls.js"></script>


	<script src="https://www.seekmedi.com/wp-includes/js/jquery/jquery.js?ver=1.12.4"></script>
	<script src="https://www.seekmedi.com/wp-content/themes/zerif-lite/js/bootstrap.min.js?ver=20120206"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

</head>


<style>
.full-width {
  width: 98%;
  max-width: 98%;
}

form.grid-padding-x {
	padding-left: 10px;
}


table.grid-padding-x {
	padding-left: 10px;
}

.calendar th, .calendar td {
	border: 1px solid black;
    padding: 5px;
    text-align: left;
}

table.calendar {
	border: 1px solid red;
	border-collapse: collapse;

}

.beta th, .beta td {
    border-style:solid;
    border-top:thick double #ff0000;
}

</style>

<body>

    <div class="grid-container full-width">
          <div class="grid-x">
            <div class="large-10 medium-10 cell">
              <div class="primary callout">
					<table id="calendar" class="calendar">
					  <thead>
					    <tr>
					      <th width="200">Table Header</th>
					      <th>Table Header</th>
					      <th width="150">Table Header</th>
					      <th width="150">Table Header</th>
					    </tr>
					  </thead>
					  <tbody>
					    <tr>
					      <td>Content Goes Here</td>
					      <td>This is longer content Donec id elit non mi porta gravida at eget metus.</td>
					      <td>Content Goes Here</td>
					      <td>Content Goes Here</td>
					    </tr>
					    <tr>
					      <td>Content Goes Here</td>
					      <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>
					      <td>Content Goes Here</td>
					      <td>Content Goes Here</td>
					    </tr>
					    <tr>
					      <td>Content Goes Here</td>
					      <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>
					      <td>Content Goes Here</td>
					      <td>Content Goes Here</td>
					    </tr>
					  </tbody>
					</table>
              </div>
            </div>
            <div class="large-2 medium-2 small-2 cell">
            </div>
          </div>
          <div class="grid-x grid-padding-x">
            <div class="large-4 medium-4 small-4 cell">
              <div class="primary callout">
                <p>Four cell</p>
              </div>
            </div>
            <div class="large-4 medium-4 small-4 cell">
              <div class="primary callout">
                <p>Four cell</p>
              </div>
            </div>
            <div class="large-4 medium-4 small-4 cell">
              <div class="primary callout">
                <p>Four cell</p>
              </div>
            </div>
          </div>
    </div>

    <script src="../foundation-6.4.1-complete/js/vendor/jquery.js"></script>
    <script src="../foundation-6.4.1-complete/js/vendor/what-input.js"></script>
    <script src="../foundation-6.4.1-complete/js/vendor/foundation.js"></script>
    <script src="../foundation-6.4.1-complete/js/app.js"></script>

    <!-- embed html -->
  	<script src="https://www.w3schools.com/lib/w3.js"></script>

<body>

<?php
	include "../Controller/manage_db.php";

	if (!isset($_SESSION['salon']) || isset($_GET['salon']) && $_GET['salon'] != $_SESSION['salon'])
	{
		die("You need to login to use this page. Or you salon is not correct.");
	}
	
	include "create_time_table.php";

	//echo '<link rel="stylesheet" type="text/css" href="table.css"></head>'; 
	//echo '<link rel="stylesheet" type="text/css" href="scrolltable.css"></head>'; 

	include "../Controller/display_func.php";
	include "draw_calendar.php";
		
	$ret = open_db($conn);

	if (!$ret)
	{
		echo 'Database cannot be open.';
		
		die('Database cannot be opened.');
	}

	$salon = $_SESSION['salon'];
	$salon_id = get_salon_id($conn, $salon);
	$staff_list = get_table_id_list($conn, "staff", $salon_id);
	$num_staffs = count($staff_list);
	
	$num_days = 3;
	$num_slots_per_hour = 4;
	$opening_hour = 9;
	$closing_hour = 19;

	$start_year 	= '';
	$start_month	= '';
	$start_date		= '';

	if (isset($_GET['date']))
	{
		$sel_date = $_GET['date'];
		sscanf($sel_date, "%d-%d-%d", $start_year, $start_month, $start_date);
	}
	else
	{
		$start_date = date("d");
		$start_month = date("m");
		$start_year = date("Y");
		$sel_date = $start_year . '-' . $start_month . '-' . $start_date;
	}

	$_SESSION['start_date'] 	=  $start_date; 
	$_SESSION['start_month'] 	=  $start_month;
	$_SESSION['start_year'] 	=  $start_year; 
	
	$_SESSION['init_date'] 	= $sel_date;

	create_nav($salon);

	$scroll_bar_width 	= 16;
	$time_column		= 80;
	$calendar_width 	= $_SESSION['screen_width'] * 0.8;  // 80% of full screen leaving space for conflict bookings
	$data_column_width	= $calendar_width - $scroll_bar_width - $time_column;
	$day_width 			= floor($data_column_width / $num_days); // + border width
	$staff_width		= floor($day_width / $num_staffs);
	
	if ($num_staffs < 4)
		$day_width = $staff_width * $num_staffs + 2 * $num_staffs - 1; // #staffs = 1 or 2 or 3 => 2 * $num_staffs - 1
	elseif ($num_staffs < 6)
		$day_width = $staff_width * $num_staffs + 2 * $num_staffs + 2; // #staffs = 4 or 5 => + 2 * $num_staffs + 2;
	elseif ($num_staffs < 8)
		$day_width = $staff_width * $num_staffs + 2 * $num_staffs + 4; // #staffs = 6 or 7 => + 2 * $num_staffs + 4;
	else
		$day_width = $staff_width * $num_staffs + 2 * $num_staffs + 9;
	
	$data_column_width 	= $day_width * $num_days;
	$calendar_width		= $data_column_width + $scroll_bar_width + $time_column;
	
	// printf('staff width = %d, day width = %d, data col = %d\n',  $staff_width, $day_width, $data_column_width);

	if (isset($_GET['name']))
		$name = $_GET['name'];
	else
		$name = '';

	if (isset($_GET['phone']))
		$phone = $_GET['phone'];
	else
		$phone = '';

	if (isset($_GET['email']))
		$email = $_GET['email'];
	else
		$email = '';

	if (isset($_GET['time']))
		$time = $_GET['time'];
	else
		$time = '';

	if (isset($_GET['staff']))
		$staff = $_GET['staff'];
	else
		$staff = '';

?>
    <div class="grid-container full-width">
        <div class="grid-x" "grid-padding-x">
            <div class="large-10 medium-10 cell">
              	<div class="primary callout">	              

				<!--div w3-include-html="cal_navigate.html"></div> 
				<script>
				w3.includeHTML();
				</script -->

				<?php
                	echo draw_calendar_days($conn, 
											$sel_date, $start_date, $start_month, $start_year, 
											$num_days, $num_slots_per_hour, 
											$salon_id, $staff_list, $opening_hour, $closing_hour,
											$calendar_width,
											$data_column_width,	
											$day_width,			
											$staff_width,
											$scroll_bar_width);	
				?>

				<!-- div w3-include-html="cal_navigate.html"></div> 
				<script>
				w3.includeHTML();
				</script-->

	          	<div class="grid-x grid-padding-x">
	          		<div class="large-1 medium-1 cell">
	          			<div class="primary callout">
						<button name="prev" style="color: red" onclick="select_prev_days()">Prev</button>
						</div>
					</div>
	          		<div class="large-1 medium-1 cell">
	          			<div class="primary callout">

						<button name="next" onclick="select_next_days()">Next</button>
						</div>
					</div>
	          		<div class="large-2 medium-2 cell">
	          			<div class="primary callout">

						<input type="date" id="select_date" name="select_date"/>
						</div>
					</div>
	          		<div class="large-1 medium-1 cell">
	          			<div class="primary callout">
						<button onclick="select_starting_day()">Select</button>
						</div>
					</div>
	          		<div class="large-4 medium-4 cell">
	          			<div class="primary callout">

						<button id="new_booking_status" value="none" onclick="display_new(this)" style="background-color:white">0 New Bookings</button>
						<button id="polling" value="stop" onclick="stop_polling(this)">Stop Polling</button>   
						</div>
					</div>
				</div>				

            </div>

        </div>

        <div class="large-2 medium-2 cell">
          	<div class="secondary callout">

				<?php check_conflict_bookings($salon_id); ?>
				<p>Booking Form</p>
					
				<!-- /* booking form */ -->
              	<div class="secondary callout" class="form_boder" id="booking_form_block"> <!-- style="display:none" -->
					
					<form class="row" id="booking_form" action="../Controller/proc_booking.php" method="get">		
						<div class="col-md-12">
							<div class="form-horizontal">
								<fieldset>
									<div class="form-group">
										<label for="booking_id" class="col-sm-4 control-label">Booking Id</label>
										<div class="col-sm-8">
											<input class="form-control" id="booking_id" placeholder="" type="text" name="booking_id" value="" readonly></input>
										</div>
									</div>
									<div class="form-group">
										<label for="salon" class="col-sm-4 control-label">Clinic</label>
										<div class="col-sm-8">
											<input class="form-control" id="salon" placeholder="Clinic name" type="text" name="salon" value="<?php echo $salon; ?>" required></input>
										</div>
									</div>
									<div class="form-group">
										<label for="staff" class="col-sm-4 control-label">Doctor's name</label>
										<div class="col-sm-8">
											<input class="form-control" id="staff" placeholder="Doctor's name" type="text" name="staff" value="<?php echo $staff; ?>" required></input>
										</div>
									</div>																
									<div class="form-group">
										<label for="date" class="col-sm-4 control-label">Date</label>
										<div class="col-sm-8">
											<input class="form-control" id="date" placeholder="dd-mm-yyy" type="text" name="date" value="<?php echo $sel_date; ?>" required></input>
										</div>
									</div>	
									<div class="form-group">
										<label for="time" class="col-sm-4 control-label">Time</label>
										<div class="col-sm-8">
											<input class="form-control" id="select_time" placeholder="hh:mm" type="text" name="time" value="<?php echo $time; ?>" required></input>
										</div>
									</div>																

									<div class="form-group">
										<label for="name" class="col-sm-4 control-label">Patient Name</label>
										<div class="col-sm-8">
											<input class="form-control" id="customer_name" placeholder="Patient name" type="text" name="name" value="<?php echo $name;?>" required></input>
										</div>
									</div>
									<div class="form-group">
										<label for="phone" class="col-sm-4 control-label">Phone Number</label>
										<div class="col-sm-8">
											<input class="form-control" id="customer_phone" placeholder="Phone number" type="tel" name="phone"  value="<?php echo $phone;?>" required></input>
										</div>
									</div>						
									<div class="form-group">
										<label for="email" class="col-sm-4 control-label">Email</label>
										<div class="col-sm-8">
											<input class="form-control" id="customer_email" placeholder="Emal Address" type="email" name="email"  value="<?php echo $email;?>" required></input>
										</div>
									</div>
									<div class="form-group">
										<label for="customer_comment" class="col-sm-4 control-label">Comment</label>
										<div class="col-sm-8">
											<textarea class="form-control" id="customer_comment" placeholder="Booking comment" type="text" name="comment" rows="3"></textarea>
										</div>
									</div>

									<input id="service" type="text" name="service" value="C" hidden/>
									<input id="booking_user_name" type="text" name="booking_user_name" value="admin" hidden/>
									<input id="status" type="text" name="status" value="admin_book" hidden/>
								</fieldset>
							</div>
						</div>

						<!--form id="booking_form" action="../Controller/proc_booking.php" method="get">		
							<table>
							<tr>
								<td class="booking_form" valign="top">
									<table>
										<tr>
											<th align="left" >Booking Id</th>
											<td><input type="text" id= "booking_id" name="booking_id" value=""/>
											</td>
										</tr>
										<tr id="service_salon" >
											<th align="left" >Salon</th>
											<td><input type="text" id="salon" name="salon" value="Family Cut" />
											</td>
										</tr>
										<tr><th id="service_type"  align="left" >Service</th><td><input type="text" id="service" name="service" required/></td></tr>
										<tr id="service_staff" ><th align="left" >Staff</th><td><input type="text" id="staff" name="staff" /></td></tr><tr><th colspan="2"></th></tr>
										<tr><th align="left" >Date</th><td><input id="date" type="date" name="date"  value="2017-03-17"  /></td></tr>
										<tr><th align="left" >Time</th><td><input type="text" name="time" id="select_time" value="18"  /></td></tr>
										<tr><th align="left" >Duration</th><td><input type="text" name="duration" id="duration" value="15"  /></td></tr>
									</table>

									<table id="customer_form" border="0px" class="booking_form" valign="top">
										<tr><th colspan="2">Customer Details</th></tr>
										<tr><th align="left">Name</th><td><input    id="customer_name" type="text" name="name" size=50 required/></td></tr>
										<tr><th align="left">Phone</th><td><input   id="customer_phone" type="tel" name="phone" size=50 required/></td></tr>
										<tr><th align="left">Email</th><td><input   id="customer_email" type="email" name="email" size=50 required/></td></tr>					 
										<tr><th align="left">Comment</th><td><input id="customer_comment" type="text" name="comment" size=50 /></td></tr>
									</table -->
									
									<p background-color="#D9FFF5" align="center">
										<input type="submit" id="add_button" 	name="add_button" 	value="Book Now" onsubmit="add_booking(this)" ></input>
										<input type="submit" id="confirm_button" name="confirm_button" value="Confirm" onclick="confirm_booking(this)"></input>
										<input type="submit" id="delete_button" name="delete_button" value="Delete" onclick="confirm_delete()"></input>
										<input type="submit" id="modify_button" name="modify_button" value="Modify" onclick="modify_booking()"></input>
										<!--input type="submit" id="cancel_button" name="cancel_button" value="Cancel" onclick="cancel_booking(this)" /input -->
									</p>
								<!--/td>
							</tr>
						</table -->
					</form>	
              	</div> <!-- end of Booking form -->

		        <div id="footer_staff_list" class="grid-x" "grid-padding-x">
		            <div class="large-12 medium-12 cell">
		              	<div class="primary callout">
		              		<div>Staff Leave Form</div>

							<?php create_footer($salon, $staff_list, $calendar_width); ?>

						</div>
					</div>
				</div>              	

				<!-- Staff leave form -->
				<form id="leave_booking_form" action="add_leave_booking_page.php" method="get" style="display:visible">			
					<table margin-left = "50px" bgcolor="grey">
						<tr><th align="left">Clinic</th>
							<td><input type="text" id= "leave_form_salon" name="leave_form_salon" size="16"/></td></tr>
						<tr><th align="left">Doctor</th>
							<td><input type="text" id="leave_form_staff" name="leave_form_staff" size="16" value="Maria"/></td></tr>
						<tr><th align="left">Leave Type</th>
							<td><input type="text" id="leave_form_type" name="leave_form_type"  size="16" value="Sick" required/></td></tr>

						<tr><th align="left">Date</th>
							<td><input id="leave_form_start_date" type="date" name="start_date" size="16" value="2017-02-20" required/></td></tr>
						<tr><th align="left">Start Time</th>
							<td><input id="leave_form_start_time"  type="time" name="start_time" size="16" value="09:00" required/></td></tr>
						<tr><th align="left">End Time</th>
							<td><input id="leave_form_end_time" type="time" name="end_time" size="16"  value="12:00" required/></td></tr>
					</table>
					<p>
						<input id="leave_form_submit" type="submit" name="leave_form_submit" value="Book Now" onsubmit="add_booking(this)" ></input>
						<!--button id="leave_cancel_submit" type="text" name="cancel_button" value="Cancel" onclick="cancel_staff_leave_form(this)">Cancel</button -->
					</p>
				</form>
			</div>
		</div>
	</div>
</div>
</body>

<?php
	/*
	echo '<table border="0px">
			<tr>
				<td>';
					echo draw_calendar_days($conn, 
											$sel_date, $start_date, $start_month, $start_year, 
											$num_days, $num_slots_per_hour, 
											$salon_id, $staff_list, $opening_hour, $closing_hour,
											$calendar_width,
											$data_column_width,	
											$day_width,			
											$staff_width,
											$scroll_bar_width);	
	echo '		</td>
				<td>
					<div id="conflict" >';
						check_conflict_bookings($salon_id);
	echo '			</div>
				</td>
			</tr>
		</table>';
	*/


?>

<!-- script>
	$(document).ready(function(){
		elem = $("#GMT");
		width = elem.width();
		alert( 'witdh = ' + width + 'innerWidth =' +  elem.innerWidth() + ', outerWidth=' + elem.outerWidth());
	});
</script -->



	
<script>
	set_starting_date();
	//start_polling(null);
	set_border(null);
	
	/*
	$(document).ready(function(){
		start_polling(null);
	});
	*/
	
</script>

<div>
<p id='status_message'>
</p>
</div>

</body>
