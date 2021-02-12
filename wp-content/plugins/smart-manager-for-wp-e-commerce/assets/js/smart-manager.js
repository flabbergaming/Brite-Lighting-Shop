/**
 * Smart Manager JS class
 * Initialize and load data in grid
 * Public interface
 **/

function Smart_Manager() { 
	var currentDashboardModel='', dashboard_key= '', dashboardName= '', dashboard_select_options= '',sm_nonce= '', column_names= new Array(), simpleSearchText = '', advancedSearchQuery= new Array(), post_data_params = '', 
		month_names_short = '', search_count, state_apply, dashboard_states = {}, skip_default_action, current_selected_dashboard = '';
}

Smart_Manager.prototype.init = function() {

	this.firstLoad = true
	this.currentDashboardModel='';
	this.dashboard_key= '';
	this.dashboardName= '';
	this.dashboard_select_options= '';
	this.sm_nonce= '';
	this.column_names= new Array();
	this.advancedSearchQuery= new Array();
	this.simpleSearchText = '';
	this.post_data_params = '';
	this.month_names_short = '';
	this.dashboardStates = {};
	this.current_selected_dashboard = '';
	this.currentDashboardData = [];
	this.currentVisibleColumns = new Array('');
	this.editedData = {};
	this.editedCellIds = [];
	this.selectedRows = [];
	this.duplicateStore = false;
	this.selectAll = false;
	this.batch_update_action_options_default = '';
	this.batch_update_actions = [];
	this.sm_beta_smart_date_filter = '';
	this.addRecords_count = 0;
	this.defaultColumnsAddRow = new Array('posts_post_status', 'posts_post_title', 'posts_post_content');
	this.columnsVisibilityUsed = false; // flag for handling column visibility
	this.totalRecords = 0;
	this.displayTotalRecords = 0;
	this.hotPlugin = {}; //object containing all Handsontable plugins
	this.gettingData = 0;
	this.searchType = sm_beta_params.search_type;
	this.advancedSearchContent = '';
	this.simpleSearchContent = '';
	this.searchTimeoutId = 0;
	this.columnSort = false;
	this.defaultEditor = true;
	this.currentGetDataParams = {};
	this.modifiedRows = [];
	this.dirtyRowColIds = {};
	this.wpToolsPanelWidth = 0;
	this.kpiData = {};
	this.defaultSortParams = { orderby: 'ID', order: 'DESC', default: true };
	this.isColumnModelUpdated = false
	this.state_apply = false;
	this.skip_default_action = false;
	this.search_count = 0;
	this.page = 1;
	this.hideDialog = '';
	this.multiselect_chkbox_list = '';
	this.limit = sm_beta_params.record_per_page;
	this.sm_dashboards_combo = '', // variable to store the dashboard name;
	this.column_names_batch_update = new Array(), // array for storing the batch update field;
	this.sm_store_table_model = new Array(), // array for storing store table mode;
	this.lastrow = '1';
	this.lastcell = '1';
	this.grid_width = '750';
	this.grid_height = '600';
	this.sm_ajax_url = (ajaxurl.indexOf('?') !== -1) ? ajaxurl + '&action=sm_beta_include_file' : ajaxurl + '?action=sm_beta_include_file';

	this.sm_qtags_btn_init = 1;
	this.sm_grid_nm = 'sm_editor_grid'; //name of div containing jqgrid
	this.sm_wp_editor_html = ''; //variable for storing the html of the wp editor
	this.sm_last_edited_row_id = '';
	this.sm_last_edited_col = '';
	this.col_model_search = '';
	this.currentColModel = '';

	//defining default actions for batch update
	this.batch_update_action_string = {set_to:'set to', prepend:'prepend', append:'append', search_and_replace:'search & replace'};
	this.batch_update_action_number = {set_to:'set to', increase_by_per:'increase by %', decrease_by_per:'decrease by %', increase_by_num:'increase by number', decrease_by_num:'decrease by number'};
	this.batch_update_action_datetime = {set_datetime_to:'set datetime to', set_date_to:'set date to', set_time_to:'set time to'};
	this.batch_update_action_multilist = {set_to:'set to', add_to:'add to', remove_from:'remove from'};

	this.batch_background_process = sm_beta_params.batch_background_process;
	this.sm_success_msg = sm_beta_params.success_msg;
	this.background_process_name = sm_beta_params.background_process_name;
	this.sm_updated_sucessfull = parseInt(sm_beta_params.updated_sucessfull);
	this.sm_updated_msg = sm_beta_params.updated_msg;
	this.sm_dashboards = sm_beta_params.sm_dashboards;
	this.sm_views = (sm_beta_params.hasOwnProperty('sm_views')) ? JSON.parse(sm_beta_params.sm_views) : {};
	this.ownedViews = (sm_beta_params.hasOwnProperty('sm_owned_views')) ? JSON.parse(sm_beta_params.sm_owned_views) : [];
	this.publicViews = (sm_beta_params.hasOwnProperty('sm_public_views')) ? JSON.parse(sm_beta_params.sm_public_views) : []
	this.viewPostTypes = (sm_beta_params.hasOwnProperty('sm_view_post_types')) ? JSON.parse(sm_beta_params.sm_view_post_types) : {}
	this.recentDashboards = (sm_beta_params.hasOwnProperty('recent_dashboards')) ? JSON.parse(sm_beta_params.recent_dashboards) : [];
	this.recentViews = (sm_beta_params.hasOwnProperty('recent_views')) ? JSON.parse(sm_beta_params.recent_views) : [];
	this.recentDashboardType = (sm_beta_params.hasOwnProperty('recent_dashboard_type')) ? sm_beta_params.recent_dashboard_type : 'post_type';
	this.sm_dashboards_public = sm_beta_params.sm_dashboards_public;
	this.sm_lite_dashboards = sm_beta_params.lite_dashboards;
	this.sm_admin_email = sm_beta_params.sm_admin_email;
	this.sm_deleted_sucessfull = parseInt(sm_beta_params.deleted_sucessfull);
	this.trashEnabled = sm_beta_params.trashEnabled;

	this.clearSearchOnSwitch = true;

	this.sm_is_woo30 = sm_beta_params.SM_IS_WOO30;
	this.sm_id_woo22 = sm_beta_params.SM_IS_WOO22;
	this.sm_is_woo21 = sm_beta_params.SM_IS_WOO21;
	this.sm_beta_pro = sm_beta_params.SM_BETA_PRO;

	this.wooPriceDecimalPlaces = ( typeof sm_beta_params.woo_price_decimal_places != 'undefined' ) ? sm_beta_params.woo_price_decimal_places : 2;
	this.wooPriceDecimalSeparator = ( typeof sm_beta_params.woo_price_decimal_separator != 'undefined' ) ? sm_beta_params.woo_price_decimal_separator : '.';

	this.wpDbPrefix = sm_beta_params.wpdb_prefix;

	this.backgroundProcessRunningMessage = sm_beta_params.background_process_running_message

	this.deletePermanently = sm_beta_params.delete_permanently

	this.window_width = jQuery(window).width();
	this.window_height = jQuery(window).height();

	this.pricingPageURL = location.href + '-pricing';
	
	this.month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	this.isSettingsPage = sm_beta_params.is_settings_page;

	//Code for setting the default dashboard
	if( typeof this.sm_dashboards != 'undefined' && this.sm_dashboards != '' ) {
		this.sm_dashboards_combo = this.sm_dashboards = JSON.parse(this.sm_dashboards);
		this.sm_lite_dashboards = JSON.parse(this.sm_lite_dashboards);

		let defaultDashboardslug = (this.sm_beta_pro == 1 && this.recentDashboardType == 'view' && this.recentViews.length > 0) ? this.recentViews[0] : this.recentDashboards[0];

		this.current_selected_dashboard = defaultDashboardslug;
		this.dashboard_key = defaultDashboardslug;
		this.dashboardName = (this.sm_beta_pro == 1 && this.recentDashboardType == 'view' && this.recentViews.length > 0) ? this.sm_views[defaultDashboardslug] : this.sm_dashboards[defaultDashboardslug];

		this.sm_nonce = this.sm_dashboards['sm_nonce'];
		delete this.sm_dashboards['sm_nonce'];
	}
	
	window.smart_manager.setDashboardDisplayName();

	this.loadMoreBtnHtml = "<button id='sm_editor_grid_load_items' style='height:2em;border: 1px solid #3892D3;background-color: white;border-radius: 3px;cursor: pointer;line-height: 17px;color:#3892D3;'> Load More <span>"+window.smart_manager.dashboardDisplayName+"</span></button>"

	this.container = document.getElementById('sm_editor_grid');

	this.body_font_size = jQuery("body").css('font-size');
	this.body_font_family = jQuery("body").css('font-family');

	//Function to set all the states on unload
	window.onbeforeunload = function (evt) { 
		if ( typeof (window.smart_manager.updateState) !== "undefined" && typeof (window.smart_manager.updateState) === "function" ) {
			window.smart_manager.updateState({'async': false}); //refreshing the dashboard states
		}
	}

	if ( !jQuery(document.body).hasClass('folded') && window.smart_manager.sm_beta_pro == 1 && !window.smart_manager.isSettingsPage ) {
		jQuery(document.body).addClass('folded');
	}

	let contentwidth = jQuery('#wpbody-content').width() - 20,
		contentheight = 910;

	let grid_height = contentheight - ( contentheight * 0.20 ); 

	window.smart_manager.grid_width = contentwidth - (contentwidth * 0.01);
	window.smart_manager.grid_height = ( grid_height < document.body.clientHeight - 400 ) ? document.body.clientHeight - 400 : grid_height;

	jQuery('#sm_editor_grid').trigger( 'smart_manager_init' ); //custom trigger

	window.smart_manager.load_dashboard();
	window.smart_manager.event_handler();
	window.smart_manager.loadNavBar();
}


Smart_Manager.prototype.convert_to_slug = function(text) {
	return text
		.toLowerCase()
		.replace(/ /g,'-')
		.replace(/[^\w-]+/g,'');
}

Smart_Manager.prototype.convert_to_pretty_text = function(text) {
	return text
		.replace(/_/g,' ')
		.split(' ')
	    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
	    .join(' ');
}

Smart_Manager.prototype.setDashboardDisplayName = function(){
	window.smart_manager.dashboardDisplayName = window.smart_manager.dashboardName;
	let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
	if(viewSlug){
		window.smart_manager.dashboardDisplayName = window.smart_manager.sm_dashboards[window.smart_manager.viewPostTypes[viewSlug]];
	}
}

Smart_Manager.prototype.load_dashboard = function() {
	jQuery('#sm_editor_grid').trigger( 'smart_manager_pre_load_dashboard' ); //custom trigger

	window.smart_manager.page = 1;

	if( typeof(window.smart_manager.currentDashboardModel) == 'undefined' || window.smart_manager.currentDashboardModel == '' ) {
		window.smart_manager.column_names = new Array('');
		window.smart_manager.column_names_batch_update = new Array();
		
		var sm_dashboard_valid = 0;
		if( window.smart_manager.sm_beta_pro == 0 ) {
			sm_dashboard_valid = 0;
			if( window.smart_manager.sm_lite_dashboards.indexOf(window.smart_manager.dashboard_key) >= 0 ) {
				sm_dashboard_valid = 1;    
			}
		} else {
			sm_dashboard_valid = 1;
		}

		if(typeof window.smart_manager.hot == 'undefined'){
			window.smart_manager.loadGrid();
		}
		
		if( sm_dashboard_valid == 1 ) {			
			window.smart_manager.getDashboardModel();
			window.smart_manager.getData();
		} else {
			jQuery("#sm_dashboard_select").val(window.smart_manager.current_selected_dashboard);

			var content = 'For managing '+ window.smart_manager.dashboardDisplayName +', '+ window.smart_manager.sm_success_msg + ' <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">Pro</a> version.';
			window.smart_manager.showNotification( 'Note', content, {autoHide: false} );
		}
	} else {
		window.smart_manager.getData();
	}

}

// Function to load top right bar on the page
Smart_Manager.prototype.loadNavBar = function() {

	//Code for simple & advanced search
	let selected = '',
	switchSearchType = ( window.smart_manager.searchType == 'simple' ) ? 'Advanced' : 'Simple';

	window.smart_manager.simpleSearchContent = "<input type='text' id='sm_simple_search_box' placeholder='Type to search...'>";
	window.smart_manager.advancedSearchContent = '<div style="width: 100%; display: flex;">'+
													'<div id="sm_advanced_search_box" style="width:74.85%">'+
														'<div id="sm_advanced_search_box_0" style="width: 100%;"></div>'+
														'<input type="text" id="sm_advanced_search_box_value_0" name="sm_advanced_search_box_value_0" hidden>'+
													'</div>'+ 
													'<input type="text" id="sm_advanced_search_query" hidden>'+
													'<div id="sm_advanced_search_or" style="cursor: pointer;color: #3892D3;" title="Add Another Condition">'+
														'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="float: inherit;height: 3em;">'+
															'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>'+
														'</svg>'+
													'</div>'+
													'<div style="margin-left: 1em;cursor: pointer;line-height:0em;">'+
														'<button id="sm_advanced_search_submit" title="Search" style="height: 2.5em;border: 1px solid #3892D3;background-color: white;border-radius: 3px;cursor: pointer;line-height: 1.5em;color: #515151;display: flex;padding-top: 0.5em;">'+
															'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="height: 1.5em;">'+
																'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>'+
															'</svg>'+
															'<span>Search</span>'+
														'</button>'+
													'</div>'+
												'</div> ';

	//Code for dashboards select2
	window.smart_manager.dashboard_select_options = '';
	
	if( window.smart_manager.sm_beta_pro == 1 ) {
		let options = '';
		// Code for rendering recently accessed dashboards
		if(window.smart_manager.recentDashboards.length > 0){
			options = '';
			window.smart_manager.recentDashboards.map((key) => {
				if(window.smart_manager.sm_dashboards.hasOwnProperty(key)){
					options += '<option value="'+key+'" '+ ((key == window.smart_manager.dashboard_key) ? "selected" : "") +'>'+window.smart_manager.sm_dashboards[key]+'</option>';
				}
			});
			window.smart_manager.dashboard_select_options += (options != '') ? '<optgroup label="Common post types">'+options+'</optgroup>' : '';
		}

		// Code for rendering recently accessed views
		if(window.smart_manager.recentViews.length > 0 && Object.keys(window.smart_manager.sm_views).length > 0){
			options = '';
			window.smart_manager.recentViews.map((key) => {
				if(window.smart_manager.sm_views.hasOwnProperty(key) && window.smart_manager.viewPostTypes.hasOwnProperty(key)){
					options += '<option value="'+window.smart_manager.viewPostTypes[key]+'" '+ ((key == window.smart_manager.dashboard_key) ? "selected" : "") +'>'+window.smart_manager.sm_views[key]+'</option>';
				}
			});
			window.smart_manager.dashboard_select_options += (options != '') ? '<optgroup label="Recently used views">'+options+'</optgroup>' : '';
		}

		// Code for rendering all remmaining dashboards
		if(Object.keys(window.smart_manager.sm_dashboards).length > 0){
			window.smart_manager.dashboard_select_options += '<optgroup label="All post types">';
			Object.keys(window.smart_manager.sm_dashboards).map((key) => {
				if(!window.smart_manager.recentDashboards.includes(key)){
					window.smart_manager.dashboard_select_options += '<option value="'+key+'" '+ ((key == window.smart_manager.dashboard_key) ? "selected" : "") +'>'+window.smart_manager.sm_dashboards[key]+'</option>';
				}
			});
			window.smart_manager.dashboard_select_options += '</optgroup>';
		}

		// Code for rendering all remmaining views
		if(Object.keys(window.smart_manager.sm_views).length > 0){
			window.smart_manager.dashboard_select_options += '<optgroup label="All saved views">';
			Object.keys(window.smart_manager.sm_views).map((key) => {
				if(!window.smart_manager.recentViews.includes(key) && window.smart_manager.viewPostTypes.hasOwnProperty(key)){
					window.smart_manager.dashboard_select_options += '<option value="'+window.smart_manager.viewPostTypes[key]+'" '+ ((key == window.smart_manager.dashboard_key) ? "selected" : "") +'>'+window.smart_manager.sm_views[key]+'</option>';
				}
			});
			window.smart_manager.dashboard_select_options += '</optgroup>';
		}

		// Code to change the dashboard key to view post type
		let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
		if(viewSlug){
			window.smart_manager.dashboard_key = window.smart_manager.viewPostTypes[viewSlug];
		}
	} else {
		Object.keys(window.smart_manager.sm_dashboards).map((key) => {
			window.smart_manager.dashboard_select_options += '<option value="'+key+'" '+ ((key == window.smart_manager.dashboard_key) ? "selected" : "") +'>'+window.smart_manager.sm_dashboards[key]+'</option>';
		});
	}

	let navBar = "<select id='sm_dashboard_select'> </select>"+
				"<div id='sm_nav_bar_search'>"+
					"<div id='search_content_parent'>"+
						"<div id='search_content' style='width:98%;'>"+
							( ( window.smart_manager.searchType == 'simple' ) ? window.smart_manager.simpleSearchContent : window.smart_manager.advancedSearchContent )+
						"</div>"+
					"</div>"+
					"<div id='sm_top_bar_advanced_search'>"+
						"<div id='search_switch_container'> <input type='checkbox' id='search_switch' switchSearchType='"+ switchSearchType.toLowerCase() +"' /><label title='Switch to "+ switchSearchType +"' for='search_switch'> "+ switchSearchType +" Search </label></div>"+
						"<div id='search_switch_lbl'> "+ String(switchSearchType).capitalize() +" Search </div>"+
					"</div>"+
				"</div>"+
				'<div id="sm_custom_views" class="sm_beta_dropdown">'+
					'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
						'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>'+
					'</svg>'+
					'<span title="Custom Views">Custom Views</span>'+
					'<div class="sm_beta_dropdown_content">'+
						'<a id="sm_custom_views_create" href="#">Create</a>'+
						'<a id="sm_custom_views_update" href="#">Update</a>'+
						'<a id="sm_custom_views_delete" href="#" class="sm-error-icon">Delete</a>'+
					'</div>'+
				'</div>';

	jQuery('#sm_nav_bar .sm_beta_left').append(navBar);
	jQuery('#sm_dashboard_select').empty().append(window.smart_manager.dashboard_select_options);
	jQuery('#sm_dashboard_select').select2({ width: '15em', dropdownCssClass: 'sm_beta_dashboard_select', dropdownParent: jQuery('#sm_nav_bar') });


	let sm_top_bar = '<div id="sm_top_bar" style="font-weight:400 !important;width:100%;">'+
						'<div id="sm_top_bar_left" class="sm_beta_left" style="width:calc('+ window.smart_manager.grid_width +'px - 2em);background-color: white;padding: 0.5em 1em 1em 1em;">'+
							'<div class="sm_top_bar_action_btns">'+
								'<div id="batch_update_sm_editor_grid" title="Bulk Edit">'+
									'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>'+
									'</svg>'+
									'<span>Bulk Edit</span>'+
								'</div>'+
							'</div>'+
							'<div class="sm_top_bar_action_btns">'+
								'<div id="save_sm_editor_grid_btn" title="Save">'+
									'<svg class="sm-ui-state-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>'+
									'</svg>'+
									'<span>Save</span>'+
								'</div>'+
								'<div id="add_sm_editor_grid" title="Add Row">'+
									'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>'+
									'</svg>'+
									'<span>Add Row</span>'+
								'</div>'+
								'<div id="dup_sm_editor_grid" class="sm_beta_dropdown">'+
									'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>'+
									'</svg>'+
									'<span title="Duplicate">Duplicate</span>'+
									'<div class="sm_beta_dropdown_content">'+
										'<a id="sm_beta_dup_selected" href="#">Selected Records</a>'+
										'<a id="sm_beta_dup_entire_store" href="#">Entire Store</a>'+
									'</div>'+
								'</div>'+
								'<div id="del_sm_editor_grid" class="sm_beta_dropdown">'+
									'<svg class="sm-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>'+
									'</svg>'+
									'<span title="Delete">Delete</span>'+
									'<div class="sm_beta_dropdown_content">'+
										'<a id="sm_beta_move_to_trash" href="#">Move to Trash</a>'+
										'<a id="sm_beta_delete_permanently" href="#" class="sm-error-icon">Delete Permanently</a>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="sm_top_bar_action_btns">'+
								'<div id="export_csv_sm_editor_grid" title="Export CSV">'+
									'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'+
									'</svg>'+
									'<span>Export CSV</span>'+
								'</div>'+
								'<div id="print_invoice_sm_editor_grid_btn" title="Print Invoice">'+
									'<svg class="sm-ui-state-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>'+
									'</svg>'+
									'<span>Print Invoice</span>'+
								'</div>'+
							'</div>'+
							'<div class="sm_top_bar_action_btns">'+
								'<div id="show_hide_cols_sm_editor_grid" title="Show / Hide Columns">'+
									'<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
										'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>;'+
									'</svg>'+
									'<span>Columns</span>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';

	let sm_bottom_bar = "<div id='sm_bottom_bar' style='font-weight:500 !important;color:#3892D3;width:"+window.smart_manager.grid_width+"px;'>"+
							"<div id='sm_bottom_bar_left' class='sm_beta_left'></div>"+
							"<div id='sm_bottom_bar_right' class='sm_beta_right'>"+
								"<div id='sm_beta_load_more_records' class='sm_beta_right' style='cursor: pointer;' title='Load more records'>"+window.smart_manager.loadMoreBtnHtml+"</div>"+
								"<div id='sm_beta_display_records' class='sm_beta_select_blue sm_beta_right'></div>"+
							"</div>"+
						"</div>";

	let sm_msg = jQuery('.sm_design_notice').prop('outerHTML');
	if(sm_msg){
		jQuery(sm_msg).insertAfter("#sm_nav_bar");
		jQuery('.wrap > .sm_design_notice').show()
	}

	jQuery(sm_top_bar).insertBefore("#sm_editor_grid");
	jQuery(sm_bottom_bar).insertAfter("#sm_editor_grid");

	if ( window.smart_manager.dashboard_key == 'shop_order' ) {
		jQuery('#print_invoice_sm_editor_grid_btn').show();
	} else {
		jQuery('#print_invoice_sm_editor_grid_btn').hide();
	}

	if( window.smart_manager.sm_beta_pro == 1 ) {
		let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
		if(viewSlug){
			jQuery('#show_hide_cols_sm_editor_grid').hide();	
		} else {
			jQuery('#show_hide_cols_sm_editor_grid').show();
		}
	} else {
		jQuery('#show_hide_cols_sm_editor_grid').show();
	}

	//Code for Dashboard KPI
	jQuery('#sm_dashboard_kpi').remove();

	if( window.smart_manager.searchType != 'simple' ) {
		window.smart_manager.initialize_advanced_search(); //initialize advanced search control
	}

	jQuery('#sm_top_bar').trigger('sm_top_bar_loaded');
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Smart_Manager.prototype.initialize_advanced_search = function() {

	if( typeof(window.smart_manager.currentColModel) == 'undefined' ) {
		return;
	}

	let colModel = JSON.parse( JSON.stringify( window.smart_manager.currentColModel ) );

	window.smart_manager.col_model_search = Object.entries(colModel).map(([key, obj]) => {

		if( obj.hasOwnProperty('searchable') && obj.searchable == 1 ) { 

			if( obj.type == 'checkbox' ) {
				obj.type = 'dropdown';
				if( !(obj.hasOwnProperty('checkedTemplate') && obj.hasOwnProperty('uncheckedTemplate')) ) {
					obj.checkedTemplate = 'true';
					obj.uncheckedTemplate = 'false';
				}
				
				obj.search_values = new Array({'key': obj.checkedTemplate, 'value':  String(obj.checkedTemplate).capitalize()},
													{'key': obj.uncheckedTemplate, 'value':  String(obj.uncheckedTemplate).capitalize()});
			}

			if( obj.type == 'text' ) {
				if( obj.hasOwnProperty('validator') ) {
					if( obj.validator == 'customNumericTextEditor' ) {
						obj.type = 'numeric';
					}
				}
			}
		
			return obj; 
		}
	});

	window.smart_manager.col_model_search = window.smart_manager.col_model_search.filter(function( element ) {
	   return element !== undefined;
	});

	var visualsearch_params = {};
	
	window.smart_manager.search_count = 1;

	visualsearch_params  = {
							el      : jQuery("#sm_advanced_search_box_0"),
							placeholder: "Enter your search conditions here!",
							strict: false,
							search: function(json){
								window.smart_manager.advancedSearchQuery[0] = json;
								jQuery("#sm_advanced_search_box_value_0").val(json);
							},
							parameters: window.smart_manager.col_model_search
						};

	if( window.smart_manager.advancedSearchQuery[0] != '' && typeof(window.smart_manager.advancedSearchQuery[0]) != 'undefined' && window.smart_manager.isJSON( window.smart_manager.advancedSearchQuery[0] ) ) {
		visualsearch_params.defaultquery = JSON.parse(window.smart_manager.advancedSearchQuery[0]);
		jQuery("#sm_advanced_search_box_value_0").val(JSON.stringify(JSON.parse(window.smart_manager.advancedSearchQuery[0])));
	}                            

	window.visualSearch = new VisualSearch(visualsearch_params);

	if( window.smart_manager.sm_beta_pro == 1 ) { //handling multiple search conditions for pro
		if( window.smart_manager.advancedSearchQuery[0] != '' && typeof(window.smart_manager.advancedSearchQuery[0]) != 'undefined' && window.smart_manager.advancedSearchQuery.length > 1 ) { //for search

			for(let i=0; i<window.smart_manager.advancedSearchQuery.length-1; i++) {
				window.smart_manager.search_count = i;
				if ( typeof window.smart_manager.addAdvancedSearchCondition !== "undefined" && typeof window.smart_manager.addAdvancedSearchCondition === "function" ) {
					window.smart_manager.addAdvancedSearchCondition();
				}
			}    
		}
	}

}

Smart_Manager.prototype.showLoader = function( is_show = true ) {
	if ( is_show ) {
		jQuery('.sm-loader-container').hide().show();
	} else {
		jQuery('.sm-loader-container').hide();
	}
}

Smart_Manager.prototype.send_request = function(params, callback, callbackParams) {

	if( typeof params.showLoader == 'undefined' || (typeof params.showLoader != 'undefined' && params.showLoader !== false ) ) {
		window.smart_manager.showLoader();
	}

	jQuery.ajax({
		type : ( ( typeof(params.call_type) != 'undefined' ) ? params.call_type : 'POST' ),
		url : ( (typeof(params.call_url) != 'undefined' ) ? params.call_url : window.smart_manager.sm_ajax_url ),
		dataType: ( ( typeof(params.data_type) != 'undefined' ) ? params.data_type : 'text' ),
		async: ( ( typeof(params.async) != 'undefined' ) ? params.async : true ),
		data: params.data,
		success: function(resp) {
			if( typeof params.showLoader == 'undefined' || (typeof params.showLoader != 'undefined' && params.showLoader !== false ) ) {
				if(false == params.hasOwnProperty('hideLoader') || (params.hasOwnProperty('hideLoader') && false != params.hideLoader) ){
					window.smart_manager.showLoader(false);
				}
			}
			return ( ( typeof(callbackParams) != 'undefined' ) ? callback(callbackParams, resp) : callback(resp) );
		},
		error: function(error) {
			console.log('Smart Manager AJAX failed::', error);
		}
	});

}

//function to format the column model
Smart_Manager.prototype.format_dashboard_column_model = function( column_model ) {

	if( window.smart_manager.currentColModel == '' || typeof(window.smart_manager.currentColModel) == 'undefined' ) {
		return;
	}

	index = 0;

	if ( typeof (window.smart_manager.sortColumns) !== "undefined" && typeof (window.smart_manager.sortColumns) === "function" ) {
		window.smart_manager.sortColumns();
	}

	window.smart_manager.column_names = [];
	window.smart_manager.currentVisibleColumns = [];

	for (i = 0; i < window.smart_manager.currentColModel.length; i++) {

			if( typeof(window.smart_manager.currentColModel[i]) == 'undefined' ) {
				continue;
			}

			hidden = ( typeof(window.smart_manager.currentColModel[i].hidden) != 'undefined' ) ? window.smart_manager.currentColModel[i].hidden : true;

			column_values = (typeof(window.smart_manager.currentColModel[i].values) != 'undefined') ? window.smart_manager.currentColModel[i].values : '';

			type = (typeof(window.smart_manager.currentColModel[i].type) != 'undefined') ? window.smart_manager.currentColModel[i].type : '';
			editor = (typeof(window.smart_manager.currentColModel[i].editor) != 'undefined') ? window.smart_manager.currentColModel[i].editor : '';
			selectOptions = (typeof(window.smart_manager.currentColModel[i].selectOptions) != 'undefined') ? window.smart_manager.currentColModel[i].selectOptions : '';
			multiSelectSeparator = (typeof(window.smart_manager.currentColModel[i].separator) != 'undefined') ? window.smart_manager.currentColModel[i].separator : '';
			allowMultiSelect = false;

			if( type == 'dropdown' && editor == 'select2' ) {
				if( window.smart_manager.currentColModel[i].hasOwnProperty('select2Options') ) {
					if( window.smart_manager.currentColModel[i].select2Options.hasOwnProperty('data') ) {

						column_values = {};
						allowMultiSelect = ( window.smart_manager.currentColModel[i].select2Options.hasOwnProperty('multiple') ) ? window.smart_manager.currentColModel[i].select2Options.multiple : false;

						window.smart_manager.currentColModel[i].select2Options.data.forEach(function(obj) {
							column_values[obj.id] = obj.text;
						});
					}
				}
			}

			let name = '';

			if( typeof( window.smart_manager.currentColModel[i].name ) != 'undefined' ) {
				name = ( window.smart_manager.currentColModel[i].name ) ? window.smart_manager.currentColModel[i].name.trim() : '';
			}

			if(window.smart_manager.currentColModel[i].hasOwnProperty('name_display') === false) {// added for state management
				window.smart_manager.currentColModel[i].name_display = name;
			}

			if( hidden === false ) {
				window.smart_manager.column_names[index] = window.smart_manager.currentColModel[i].name_display; //Array for column headers
				window.smart_manager.currentVisibleColumns[index] = window.smart_manager.currentColModel[i];
				index++;
			}

			var batch_enabled_flag = false;

			if (window.smart_manager.currentColModel[i].hasOwnProperty('batch_editable')) {
				batch_enabled_flag = window.smart_manager.currentColModel[i].batch_editable;
			}

			if (batch_enabled_flag === true) {

				let type = window.smart_manager.currentColModel[i].type;

				if(window.smart_manager.currentColModel[i].hasOwnProperty('validator')) {
					if('customNumericTextEditor' == window.smart_manager.currentColModel[i].validator){
						type = 'numeric';	
					}
				}

				window.smart_manager.column_names_batch_update[window.smart_manager.currentColModel[i].src] = {name: window.smart_manager.currentColModel[i].name_display, type:type, editor:window.smart_manager.currentColModel[i].editor, values:column_values, src:window.smart_manager.currentColModel[i].data, allowMultiSelect:allowMultiSelect, multiSelectSeparator:multiSelectSeparator};

				if( window.smart_manager.currentColModel[i].type == 'checkbox' ) {
					window.smart_manager.column_names_batch_update[window.smart_manager.currentColModel[i].src]['checkedTemplate'] = 'true';
					window.smart_manager.column_names_batch_update[window.smart_manager.currentColModel[i].src]['uncheckedTemplate'] = 'false';

					if( window.smart_manager.currentColModel[i].hasOwnProperty('checkedTemplate') ) {
						window.smart_manager.column_names_batch_update[window.smart_manager.currentColModel[i].src]['checkedTemplate'] = window.smart_manager.currentColModel[i]['checkedTemplate'];
					}

					if( window.smart_manager.currentColModel[i].hasOwnProperty('uncheckedTemplate') ) {
						window.smart_manager.column_names_batch_update[window.smart_manager.currentColModel[i].src]['uncheckedTemplate'] = window.smart_manager.currentColModel[i]['uncheckedTemplate'];
					}
				}

			}

			if ( typeof(window.smart_manager.currentColModel[i].allow_showhide) != 'undefined' && window.smart_manager.currentColModel[i].allow_showhide === false ) {
				window.smart_manager.currentColModel[i].hidedlg = true;
			}
			
			window.smart_manager.currentColModel[i].name = window.smart_manager.currentColModel[i].index;

			// setting the default width
			if (typeof(window.smart_manager.currentColModel[i].width) == 'undefined') {
				// window.smart_manager.currentColModel[i].width = 80;
			}

			//Code for formatting the values
			var formatted_values = '';
			window.smart_manager.currentColModel[i].wordWrap = true;

	}
}

Smart_Manager.prototype.setDashboardModel = function (response) {

	if( typeof response != 'undefined' && response != '' ) {
		window.smart_manager.sm_store_table_model = response.tables;
		window.smart_manager.currentColModel = response.columns;

		//call to function for formatting the column model
		if( typeof( window.smart_manager.format_dashboard_column_model ) !== "undefined" && typeof( window.smart_manager.format_dashboard_column_model ) === "function" ) {
			window.smart_manager.format_dashboard_column_model();
		}
		response.columns = window.smart_manager.currentColModel;
		window.smart_manager.currentDashboardModel = response;

		//Code for rendering the columns in grid
		window.smart_manager.formatGridColumns();
		window.smart_manager.hot.updateSettings({
			data: window.smart_manager.currentDashboardData,
			columns: window.smart_manager.currentVisibleColumns,
			colHeaders: window.smart_manager.column_names,
			forceRender: window.smart_manager.firstLoad
		})

		if(window.smart_manager.firstLoad){
			window.smart_manager.firstLoad = false
		}

		if(window.smart_manager.sm_beta_pro == 1){

			jQuery('#sm_custom_views_update, #sm_custom_views_delete').hide();

			let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
			if(viewSlug){
				if(window.smart_manager.ownedViews.includes(viewSlug)) {
					jQuery('#sm_custom_views_update, #sm_custom_views_delete').show();
				}
			}

			if(response.hasOwnProperty('search_params')){
				let searchType = 'simple';
				
				if(response.search_params.hasOwnProperty('isAdvanceSearch')){
					if(response.search_params.isAdvanceSearch == 'true'){
						searchType = 'advanced'
					}
				}
	
				if(response.search_params.hasOwnProperty('params')){
					if( searchType == 'simple' ) {
						window.smart_manager.simpleSearchText = response.search_params.params;
						window.smart_manager.advancedSearchQuery = new Array();
						jQuery('#search_switch').prop('checked', false);
					} else {
						window.smart_manager.simpleSearchText = '';
						window.smart_manager.advancedSearchQuery = response.search_params.params;
						jQuery('#search_switch').prop('checked', true);
					}
				}
				window.smart_manager.clearSearchOnSwitch = false;
				window.smart_manager.searchType = ( searchType == 'simple' ) ? 'advanced' : 'simple';
				let el = '#search_switch';
				jQuery(el).attr('switchSearchType', searchType);
				jQuery(el).trigger('change'); //Code to re-draw the search content based on search type
				if( searchType == 'simple' ) {
					jQuery('#sm_simple_search_box').val(window.smart_manager.simpleSearchText);
				}
				window.smart_manager.clearSearchOnSwitch = true;
			}
		}

		if( window.smart_manager.searchType != 'simple' && !response.hasOwnProperty('search_params') ) {
			window.smart_manager.initialize_advanced_search(); //initialize advanced search control
		}

		jQuery('#sm_editor_grid').trigger( 'smart_manager_post_load_grid' ); //custom trigger
	}
}

Smart_Manager.prototype.getViewSlug = function(title = '') {
	return Object.keys(window.smart_manager.sm_views).find(key => window.smart_manager.sm_views[key] === title);
}

Smart_Manager.prototype.getDashboardModel = function () {

	window.smart_manager.currentDashboardModel = '';

	// Ajax request to get the dashboard model
	let params = {};
		params.data_type = 'json';
		params.hideLoader = false;
		params.data = {
						cmd: 'get_dashboard_model',
						security: window.smart_manager.sm_nonce,
						active_module: window.smart_manager.dashboard_key,
						is_public: ( window.smart_manager.sm_dashboards_public.indexOf(window.smart_manager.dashboard_key) != -1 ) ? 1 : 0,
						active_module_title: window.smart_manager.dashboardName
					};
		
		// Code for passing extra param for view handling
		if( window.smart_manager.sm_beta_pro == 1 ) {
			let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
			params.data['is_view'] = 0;

			if(viewSlug){
				params.data['is_view'] = 1;
				params.data['active_view'] = viewSlug;
				params.data['active_module'] = (window.smart_manager.viewPostTypes.hasOwnProperty(viewSlug)) ? window.smart_manager.viewPostTypes[viewSlug] : window.smart_manager.dashboard_key;
			}
		}

	window.smart_manager.send_request(params, window.smart_manager.setDashboardModel);
}

Smart_Manager.prototype.set_data = function(response) {
	if( typeof response != 'undefined' && response != '' ) {
		let res = {};

		if( response != 'null' && window.smart_manager.isJSON( response ) ) {
			res = JSON.parse(response);

			window.smart_manager.totalRecords = parseInt(res.total_count);
			window.smart_manager.displayTotalRecords = ( res.hasOwnProperty('display_total_count') ) ? res.display_total_count : res.total_count;

			if( window.smart_manager.page > 1 ) {
			
				window.smart_manager.showLoader(false);

				let lastRowIndex = window.smart_manager.currentDashboardData.length;
				window.smart_manager.currentDashboardData = window.smart_manager.currentDashboardData.concat(res.items);
				
				if( window.smart_manager.page > 1 ) {

					window.smart_manager.hot.forceFullRender = false
					window.smart_manager.hot.loadData(window.smart_manager.currentDashboardData, false);
				
					if( window.smart_manager.sm_beta_pro == 0 ) {
						if( typeof( window.smart_manager.modifiedRows ) != 'undefined' ) {
							if( window.smart_manager.modifiedRows.length >= window.smart_manager.sm_updated_sucessfull ) {
								//call to function for highlighting selected row ids
								if( typeof( window.smart_manager.disableSelectedRows ) !== "undefined" && typeof( window.smart_manager.disableSelectedRows ) === "function" ) {
									window.smart_manager.disableSelectedRows(true);
								}
							}
						}
					}
				}
			} else {
				window.smart_manager.currentDashboardData = ( window.smart_manager.totalRecords > 0 ) ? res.items : [];
			}
		} else {
			window.smart_manager.currentDashboardData = [];
		}

		if( window.smart_manager.page == 1 ) {
			if( window.smart_manager.columnSort ) {
				window.smart_manager.hot.loadData(window.smart_manager.currentDashboardData);
				window.smart_manager.hot.scrollViewportTo(0, 0);
			} else {

				jQuery('#sm_dashboard_kpi').remove();

				if( res.hasOwnProperty('kpi_data') ) {
					window.smart_manager.kpiData = res.kpi_data;
					if( Object.entries(window.smart_manager.kpiData).length > 0 ) {
						let kpi_html = new Array();
				
						Object.entries(window.smart_manager.kpiData).forEach(([kpiTitle, kpiObj]) => {
							kpi_html.push('<span class="sm_beta_select_'+ ( ( kpiObj.hasOwnProperty('color') !== false && kpiObj['color'] != '' ) ? kpiObj['color'] : 'grey' ) +'"> '+ kpiTitle +'('+ ( ( kpiObj.hasOwnProperty('count') !== false ) ? kpiObj['count'] : 0 ) +') </span>');
						});

						if( kpi_html.length > 0 ) {
							jQuery('#sm_bottom_bar_left').append('<div id="sm_dashboard_kpi">'+ kpi_html.join("<span class='sm_separator'> | </span>") +'</div>' );
						}
					}
				} else {
					window.smart_manager.kpiData = {};
				}

				if(window.smart_manager.currentVisibleColumns.length > 0){
					if(window.smart_manager.isColumnModelUpdated){
						window.smart_manager.formatGridColumns();
						
						window.smart_manager.hot.updateSettings({
							data: window.smart_manager.currentDashboardData,
							columns: window.smart_manager.currentVisibleColumns,
							colHeaders: window.smart_manager.column_names,
							// forceRender: window.smart_manager.firstLoad
						})	
					} else {
						window.smart_manager.hot.updateSettings({
							data: window.smart_manager.currentDashboardData,
							forceRender: window.smart_manager.firstLoad
						})
					}
					if(window.smart_manager.firstLoad){
						window.smart_manager.firstLoad = false
					}
				}
				window.smart_manager.showLoader(false);
			}
		}

		window.smart_manager.refreshBottomBar();

		if(window.smart_manager.totalRecords == 0){
			jQuery('#sm_editor_grid_load_items').attr('disabled','disabled');
				jQuery('#sm_editor_grid_load_items').addClass('sm-ui-state-disabled');
	
				jQuery('#sm_bottom_bar_right #sm_beta_display_records').hide();
				jQuery('#sm_bottom_bar_right #sm_beta_load_more_records').text('No '+ window.smart_manager.dashboardDisplayName +' Found');
		} else {
			if( window.smart_manager.currentDashboardData.length >= window.smart_manager.totalRecords ) {
				jQuery('#sm_editor_grid_load_items').attr('disabled','disabled');
				jQuery('#sm_editor_grid_load_items').addClass('sm-ui-state-disabled');
	
				jQuery('#sm_bottom_bar_right #sm_beta_display_records').hide();
				jQuery('#sm_bottom_bar_right #sm_beta_load_more_records').text(window.smart_manager.displayTotalRecords +' '+ window.smart_manager.dashboardDisplayName +' loaded');
	
			} else {
				jQuery('#sm_bottom_bar_right #sm_beta_display_records').show();
				jQuery('#sm_editor_grid_load_items').removeAttr('disabled');
				jQuery('#sm_editor_grid_load_items').removeClass('sm-ui-state-disabled');
				jQuery('#sm_bottom_bar_right #sm_beta_load_more_records').html(window.smart_manager.loadMoreBtnHtml);
				jQuery('#sm_bottom_bar_right #sm_editor_grid_load_items span').html(window.smart_manager.dashboardDisplayName);
			}
			jQuery('#sm_bottom_bar_right').show();
		}

		window.smart_manager.gettingData = 0;
	}
}

//Function to refresh the bottom bar of grid
Smart_Manager.prototype.refreshBottomBar = function() {
	let msg = ( window.smart_manager.currentDashboardData.length > 0 ) ? window.smart_manager.displayTotalRecords +" "+ window.smart_manager.dashboardDisplayName : 'No '+ window.smart_manager.dashboardDisplayName +' Found';
	jQuery('#sm_bottom_bar_right #sm_beta_display_records').html(msg);
}


Smart_Manager.prototype.getDataDefaultParams = function(params) {

	let defaultParams = {};
		defaultParams.data = {
						  cmd: 'get_data_model',
						  active_module: window.smart_manager.dashboard_key,
						  security: window.smart_manager.sm_nonce,
						  is_public: ( window.smart_manager.sm_dashboards_public.indexOf(window.smart_manager.dashboard_key) != -1 ) ? 1 : 0,
						  sm_page: window.smart_manager.page,
						  sm_limit: window.smart_manager.limit,
						  SM_IS_WOO30: window.smart_manager.sm_is_woo30,
						  sort_params: (window.smart_manager.currentDashboardModel.hasOwnProperty('sort_params') ) ? window.smart_manager.currentDashboardModel.sort_params : '',
						  table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : '',
						  search_text: window.smart_manager.simpleSearchText
					  };

	defaultParams.data['search_query[]'] = window.smart_manager.advancedSearchQuery;

	// Code for passing extra param for view handling
	if( window.smart_manager.sm_beta_pro == 1 ) {
		let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
		defaultParams.data['is_view'] = 0;

		if(viewSlug){
			defaultParams.data['is_view'] = 1;
			defaultParams.data['active_view'] = viewSlug;
			defaultParams.data['active_module'] = (window.smart_manager.viewPostTypes.hasOwnProperty(viewSlug)) ? window.smart_manager.viewPostTypes[viewSlug] : window.smart_manager.dashboard_key;
		}
	}

	if( typeof params != 'undefined' ) {
		if( Object.getOwnPropertyNames(params).length > 0 ) {
			defaultParams = Object.assign(params.data, defaultParams.data);
			defaultParams = Object.assign(params, defaultParams);    
		}    
	}

	window.smart_manager.currentGetDataParams = defaultParams;
}

Smart_Manager.prototype.getData = function(params) {

	window.smart_manager.gettingData = 1;

	if( window.smart_manager.page == 1 ) {

		
		if ( typeof (window.smart_manager.getDataDefaultParams) !== "undefined" && typeof (window.smart_manager.getDataDefaultParams) === "function" ) {
			window.smart_manager.getDataDefaultParams(params);
			window.smart_manager.currentGetDataParams.hideLoader = false
		}
	} else {
		if( typeof(window.smart_manager.currentGetDataParams.data) != 'undefined' && typeof(window.smart_manager.currentGetDataParams.data.sm_page) != 'undefined' ) {
			window.smart_manager.currentGetDataParams.data.sm_page = window.smart_manager.page;
			window.smart_manager.currentGetDataParams.data.sort_params = window.smart_manager.currentDashboardModel.sort_params;
		}
	}

	window.smart_manager.send_request(window.smart_manager.currentGetDataParams, window.smart_manager.set_data);
}

Smart_Manager.prototype.inline_edit_dlg = function(params) {

		if (params.dlg_width == '' || typeof (params.dlg_width) == 'undefined') {
			modal_width = 350;
		} else {
			modal_width = params.dlg_width;
		}

		if (params.dlg_height == '' || typeof (params.dlg_height) == 'undefined') {
			modal_height = 390;
		} else {
			modal_height = params.dlg_height;
		}

		let ok_btn = [{
					  text: "OK",
					  class: 'sm_inline_dialog_ok sm-dlg-btn-yes',
					  click: function() {
						jQuery( this ).dialog( "close" );
					  }
					}];

		jQuery( "#sm_inline_dialog" ).html(params.content);

		let dialog_params = {
								closeOnEscape: true,
								draggable: false,
								dialogClass: 'sm_ui_dialog_class',
								height: modal_height,
								width: modal_width,
								modal: (params.hasOwnProperty('modal')) ? params.modal : false,
								position: {my: ( params.hasOwnProperty('position_my') ) ? params.position_my : 'left center+250px',
											at: ( params.hasOwnProperty('position_my') ) ? params.position_at : 'left center', 
											of: params.target},
								create: function (event, ui) {
									if( !(params.hasOwnProperty('title') && params.title != '') ) {
										jQuery(".ui-widget-header").hide();
									}
								},
								open: function() {

									if( params.hasOwnProperty('show_close_icon') && params.show_close_icon === false ) {
										jQuery(this).find('.ui-dialog-titlebar-close').hide();
									}

									jQuery('.ui-widget-overlay').bind('click', function() { 
									    jQuery('#sm_inline_dialog').dialog('close'); 
									});

									if( !(params.hasOwnProperty('title') && params.title != '') ) {
										jQuery(".ui-widget-header").hide();
									} else if( (params.hasOwnProperty('title') && params.title != '') ) {
										jQuery(".ui-widget-header").show();
									}

									if( params.hasOwnProperty('customDataAttributes') ) {
										Object.entries(params.customDataAttributes).forEach(([key, value]) => {
											jQuery(this).attr(key, value);											
										});
									}

									jQuery(this).html(params.content);
								},
								close: function(event, ui) { 
									jQuery(this).dialog('close');
								},
							  buttons: ( params.hasOwnProperty('display_buttons') && params.display_buttons === false ) ? [] : ( params.hasOwnProperty('buttons_model') ? params.buttons_model : ok_btn )
							}

		if( params.hasOwnProperty('title') ) {
			dialog_params.title = params.title;
		}

		if( params.hasOwnProperty('titleIsHtml') ) {
			dialog_params.titleIsHtml = params.titleIsHtml;
		}
		
		jQuery( "#sm_inline_dialog" ).dialog(dialog_params);
		jQuery('.sm_ui_dialog_class, .ui-widget-overlay').show();
}

Smart_Manager.prototype.getTextWidth = function (text, font) {
    // re-use canvas object for better performance
    let canvas = window.smart_manager.getTextWidthCanvas || (window.smart_manager.getTextWidthCanvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}

Smart_Manager.prototype.formatGridColumns = function () {
	if(Array.isArray(window.smart_manager.currentVisibleColumns) && window.smart_manager.currentVisibleColumns.length > 0){
		window.smart_manager.currentVisibleColumns.map((c, i) => {
			let colWidth = c.width || 0;
			let header_text = window.smart_manager.column_names[i],
				font = '30px Arial';
				// font = '26px ' + window.smart_manager.body_font_family;

			let newWidth = window.smart_manager.getTextWidth(header_text,font);

			if( newWidth > colWidth ) {
				c.width = ( newWidth < 250 ) ? newWidth : 250;
			}
			window.smart_manager.currentVisibleColumns[i] = c
		})
	}
}

Smart_Manager.prototype.enableDisableButtons = function() {
	//enabling the action buttons
	if( window.smart_manager.selectedRows.length > 0 || window.smart_manager.selectAll ) {
		if( jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').hasClass('sm-ui-state-disabled') ) {
			jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').removeClass('sm-ui-state-disabled');
		}

		if( jQuery('.sm_top_bar_action_btns #print_invoice_sm_editor_grid_btn svg').hasClass('sm-ui-state-disabled') ) {
			jQuery('.sm_top_bar_action_btns #print_invoice_sm_editor_grid_btn svg').removeClass('sm-ui-state-disabled');
		}

	} else {
		if( !jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').hasClass('sm-ui-state-disabled') ) {
			jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').addClass('sm-ui-state-disabled');
		}

		if( !jQuery('.sm_top_bar_action_btns #print_invoice_sm_editor_grid_btn svg').hasClass('sm-ui-state-disabled') ) {
			jQuery('.sm_top_bar_action_btns #print_invoice_sm_editor_grid_btn svg').addClass('sm-ui-state-disabled');
		}
	}
}


Smart_Manager.prototype.disableSelectedRows = function( readonly ) {

	for (let i = 0; i < window.smart_manager.hot.countRows(); i++) {

		if( window.smart_manager.modifiedRows.indexOf(i) != -1 ) {
			continue;
		}

		for (let j = 0; j < window.smart_manager.hot.countCols(); j++) {
			window.smart_manager.hot.setCellMeta( i, j, 'readOnly', readonly );
		}
	}

}

//Function to highlight the edited cells
Smart_Manager.prototype.highlightEditedCells = function() {

	if( typeof window.smart_manager.dirtyRowColIds == 'undefined' || Object.getOwnPropertyNames(window.smart_manager.dirtyRowColIds).length == 0 ) {
		return;
	}

	for( let row in window.smart_manager.dirtyRowColIds ) {

		window.smart_manager.dirtyRowColIds[row].forEach(function(colIndex) {
			
			cellProp = window.smart_manager.hot.getCellMeta(row, colIndex);
			prevClassName = cellProp.className;

			if( prevClassName == '' || typeof prevClassName == 'undefined' || ( typeof(prevClassName) != 'undefined' && prevClassName.indexOf('sm-grid-dirty-cell') == -1 ) ) {
				window.smart_manager.hot.setCellMeta(row, colIndex, 'className', (prevClassName + ' ' + 'sm-grid-dirty-cell'));
				jQuery('.smCheckboxColumnModel input[data-row='+row+']').parents('tr').removeClass('sm_edited').addClass('sm_edited');
			}
		});
	}
}

Smart_Manager.prototype.isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

Smart_Manager.prototype.isJSON = function(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}


Smart_Manager.prototype.getCustomRenderer = function ( col ) {
  
	let customRenderer = '';

	let colObj = window.smart_manager.currentVisibleColumns[col];

	if( typeof( colObj ) != 'undefined' ) {

		let renderer = ( colObj.hasOwnProperty('renderer') ) ? colObj.renderer : '';

		if( colObj.hasOwnProperty('type') ) {
			if( colObj.type == 'numeric' ) {
				customRenderer = 'numericRenderer';
			} else if( colObj.type == 'text' && renderer != 'html' ) {
				customRenderer = 'customTextRenderer';
			} else if( colObj.type == 'html' || renderer == 'html' ) {
				customRenderer = 'customHtmlRenderer';
			} else if( colObj.type == 'checkbox' ) {
				// customRenderer = 'customCheckboxRenderer';
			} else if( colObj.type == 'password' ) {
				customRenderer = 'customPasswordRenderer';
			}
		}
	}

	return customRenderer;
}


Smart_Manager.prototype.generateImageGalleryDlgHtml = function( imageObj ) {

	let html = '';

	if( typeof( imageObj ) !== "undefined" ) {
		Object.entries(imageObj).forEach(([id, imageUrl]) => {
			html += '<div class="sm_beta_left sm_gallery_image">'+
						'<img data-id="'+ id +'" src="'+ imageUrl +'" width="150" height="150"></img>'+
						'<div style="text-align:center;"> <span class="dashicons dashicons-trash sm_beta_select_red sm_gallery_image_delete" title="Remove gallery image"> </div>'+
					'</div>';

		});	
	}

	return html;
}

Smart_Manager.prototype.handleMediaUpdate = function( params ) {
	
	let file_frame;
					
	// If the media frame already exists, reopen it.
	if ( file_frame ) {
	  file_frame.open();
	  return;
	}

	let allowMultiple = ( params.hasOwnProperty('allowMultiple') ) ? params.allowMultiple : false;
	
	// Create the media frame.
	file_frame = wp.media.frames.file_frame = wp.media({
	  title: ( params.hasOwnProperty('uploaderTitle') ) ? params.uploaderTitle : jQuery( this ).data( 'uploader_title' ),
	  button: {
		text: ( params.hasOwnProperty('uploader_button_text') ) ? params.uploaderButtonText : jQuery( this ).data( 'uploader_button_text' ),
	  },
	  library: {
	    type: 'image'
	  },
	  multiple: allowMultiple  // Set to true to allow multiple files to be selected
	});

	if( params.hasOwnProperty('callback') ) {
		file_frame.on( 'select', function() {

			let attachments = ( allowMultiple ) ? file_frame.state().get('selection').toJSON() : file_frame.state().get('selection').first().toJSON();
			params.callback( attachments )
		});
	}

	file_frame.open();

}

Smart_Manager.prototype.inlineUpdateMultipleImages = function( galleryImages ) {
	let params = {};
	params.data = {
					cmd: 'inline_update',
					active_module: window.smart_manager.dashboard_key,
					edited_data: JSON.stringify(galleryImages),
					security: window.smart_manager.sm_nonce,
					pro: ( ( typeof(window.smart_manager.sm_beta_pro) != 'undefined' ) ? window.smart_manager.sm_beta_pro : 0 ),
					table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : ''
				};

	window.smart_manager.send_request(params, function(response) {
		window.smart_manager.refresh();
	});
};



Smart_Manager.prototype.showImagePreview = function(params) {
	let xOffset = 150,
		yOffset = 30;

	if( jQuery('#sm_img_preview').length == 0 ) {
		jQuery("body").append("<div id='sm_img_preview' style='z-index:100199;'><div style='margin: 1em; padding: 1em; border-radius: 0.1em; border: 0.1em solid #ece0e0;'><img src='" + params.current_cell_value + "' width='300' /></div><div id='sm_img_preview_text'>"+ params.title +"</div></div>");
	}

	jQuery("#sm_img_preview")
    	.css("top", (params.event.pageY - xOffset) + "px")
    	.css("left", (params.event.pageX + yOffset) + "px")
    	.fadeIn("fast")
    	.show();
}

Smart_Manager.prototype.loadGrid = function() {
	jQuery('#sm_editor_grid').html('');
	window.smart_manager.formatGridColumns();
	window.smart_manager.hot = new Handsontable(window.smart_manager.container, {
																				  data: window.smart_manager.currentDashboardData,
																				  height: window.smart_manager.grid_height,
																				  width: window.smart_manager.grid_width,
																				//   allowEmpty: true, // default is true
																				  rowHeaders: function(index) {
																					return '<input type="checkbox" />';
																				  }, // for row headings (like numbering)
																				  colHeaders: true, // for col headings
																				//   renderAllRows: true,
																				//   viewportRowRenderingOffset: 100, // -- problem no. of rows outside the visible part of table. Default: auto
																				  stretchH: 'all', // strech 
																				  autoColumnSize: {useHeaders: true},
																				//   wordWrap: true, //default is true
																				//   autoRowSize: false, // by default its undefined which is also same
																				  rowHeights: '40px',
																				  colWidths: 100,
																				  bindRowsWithHeaders: true,
																				  manualColumnResize: true,
																				//   manualRowResize: true,
																				  manualColumnMove: false,
																				  columnSorting: true,
																				//   columnSorting: { sortEmptyCells: false }, //--problem
																				  fillHandle: 'vertical', //for excel like filling of cells
																				  persistentState: true,
																				  customBorders: true,
																				//   disableVisualSelection: true,
																				  columns: window.smart_manager.currentVisibleColumns,
																				  colHeaders: window.smart_manager.column_names, 
																				});

	window.smart_manager.hotPlugin.columnSortPlugin = window.smart_manager.hot.getPlugin('columnSorting');
	
	//Code for handling sort state management
	if( window.smart_manager.currentDashboardModel.hasOwnProperty('sort_params') ) {
		if( window.smart_manager.currentDashboardModel.sort_params ) {
			if( window.smart_manager.currentDashboardModel.sort_params.hasOwnProperty('default') ) {
				window.smart_manager.hotPlugin.columnSortPlugin.sort();
			} else {
				if( window.smart_manager.currentVisibleColumns.length > 0 ) {
					for( let index in window.smart_manager.currentVisibleColumns ) {
						if( window.smart_manager.currentVisibleColumns[index].src == window.smart_manager.currentDashboardModel.sort_params.column ) {
							let sort_params = Object.assign({}, window.smart_manager.currentDashboardModel.sort_params);
							sort_params.column = parseInt(index);
							window.smart_manager.hotPlugin.columnSortPlugin.setSortConfig([sort_params]);
							break;
						}
					}
				}
			}
		}
	}

	//Code to have title for each of the column headers
	jQuery('table.htCore').find('.colHeader').each(function() {
		jQuery(this).attr('title',jQuery(this).text()+' (Click to sort)');
	});
	
	window.smart_manager.hot.updateSettings({

		cells: function(row, col, prop) {
			
			let customRenderer = window.smart_manager.getCustomRenderer( col );

			if( customRenderer != '' ) {
				let cellProperties = {};
				cellProperties.renderer = customRenderer;
				return cellProperties;						
			}
			
		},

		afterOnCellMouseOver: function(e, coords, td) {
			if( coords.row < 0 || coords.col < 0 ) {
				return;
			}

			let col = this.getCellMeta(coords.row, coords.col),
				current_cell_value = this.getDataAtCell(coords.row, coords.col);
			if( typeof(col.type) != 'undefined' && current_cell_value ) {
				if( col.type == 'sm.image' ) {
					let row_title = '';
					if( window.smart_manager.dashboard_key == 'product' ) {
						row_title = this.getDataAtRowProp(coords.row, 'posts_post_title');
						row_title = ( window.smart_manager.isHTML(row_title) == true ) ? jQuery(row_title).text() : row_title;
						row_title = row_title;
					}
					let params = {
									'current_cell_value': current_cell_value,
									'event': e,
									'title': row_title
								};

					if( typeof( window.smart_manager.showImagePreview ) !== "undefined" && typeof( window.smart_manager.showImagePreview ) === "function" ) {
						window.smart_manager.showImagePreview(params);
					}					
				}
			}
		},

		afterOnCellMouseOut: function(e, coords, td) {
			if( jQuery('#sm_img_preview').length > 0 ) {
				jQuery('#sm_img_preview').remove();
			}
		},

		afterRender: function( isForced ) { //TODO: check
			if( isForced === true ) {
				window.smart_manager.showLoader(false);
			}
		},

		beforeColumnSort: function(currentSortConfig, destinationSortConfigs) {
		  	window.smart_manager.hotPlugin.columnSortPlugin.setSortConfig(destinationSortConfigs);
		  	if( typeof(destinationSortConfigs) != 'undefined' ) {
		  		if( destinationSortConfigs.length > 0 ) {
		  			if( destinationSortConfigs[0].hasOwnProperty('column') ) {
			  			if( window.smart_manager.currentVisibleColumns.length > 0 ) {
			  				let colObj = window.smart_manager.currentVisibleColumns[destinationSortConfigs[0].column];

			  				window.smart_manager.currentDashboardModel.sort_params = { 'column': colObj.src,
											'sortOrder': destinationSortConfigs[0].sortOrder };

			  				window.smart_manager.columnSort = true;
			  			}
			  		}	
		  		} else {
		  			if( window.smart_manager.currentDashboardModel.hasOwnProperty('sort_params') ) {
		  				window.smart_manager.currentDashboardModel.sort_params = Object.assign({}, window.smart_manager.defaultSortParams);
		  			}
		  			window.smart_manager.columnSort = false;
		  		}

		  		window.smart_manager.page = 1;
		  		window.smart_manager.getData();
		  	}
		  	return false; // The blockade for the default sort action.
		},

		afterCreateRow: function (row, amount) {
			
			while( amount > 0 ) {
				// setTimeout( function() { //added for handling dirty class for edited cells

					let idKey = ( window.smart_manager.dashboard_key == 'user' ) ? 'users_id' : 'posts_id';
					let row_data_id = window.smart_manager.hot.getDataAtRowProp(row, idKey);

					if( typeof(row_data_id) != 'undefined' && row_data_id ) {
						return;
					}

					window.smart_manager.addRecords_count++;
					window.smart_manager.hot.setDataAtRowProp(row,idKey,'sm_temp_'+window.smart_manager.addRecords_count);

					let val = '',
						colObj = {};

					for( let key in window.smart_manager.currentColModel ) {

						colObj = window.smart_manager.currentColModel[key];

						if( colObj.hasOwnProperty('data') ) {
							if( jQuery.inArray(colObj.data, window.smart_manager.defaultColumnsAddRow) >= 0 ) {

								if( typeof colObj.defaultValue != 'undefined' ) {
									val = colObj.defaultValue;
								} else {
									if( typeof colObj.selectOptions != 'undefined' ) {
										val = Object.keys(colObj.selectOptions)[0]
									} else {
										val = 'test';
									}
								}

								window.smart_manager.hot.setDataAtRowProp(row, colObj.data, val);
							}
						}
					}
				// }, 1 );
				row++;
				amount--;
			}
		},

		afterChange: function(changes, source) {

			if( window.smart_manager.selectAll === true || changes === null ) {
				return;
			}

			let col = {},
				cellProp = {},
				colIndex = '',
				idKey = ( window.smart_manager.dashboard_key == 'user' ) ? 'users_id' : 'posts_id',
				colTypesDisabledHiglight = new Array('sm.image');

			changes.forEach(([row, prop, oldValue, newValue]) => {

				if( ( row < 0 && prop == 0 ) || (oldValue == newValue && String(oldValue).length == String(newValue).length) ) {
					return;
				}

				if( window.smart_manager.modifiedRows.indexOf(row) == -1 ) {
					window.smart_manager.modifiedRows.push(row);
				}
				
				colIndex = window.smart_manager.hot.propToCol(prop);
				if( typeof(colIndex) == 'number' ) {
					col = window.smart_manager.hot.getCellMeta(row, colIndex);
				}

				let id = window.smart_manager.hot.getDataAtRowProp(row, idKey);

				if( (oldValue != newValue || String(oldValue).length != String(newValue).length) && prop != idKey && colTypesDisabledHiglight.indexOf(col.type) == -1 ) { //for inline edit
					cellProp = window.smart_manager.hot.getCellMeta(row, prop);
					prevClassName = ( typeof(cellProp.className) != 'undefined' ) ? cellProp.className : '';

					//dirty cells variable
					if( window.smart_manager.dirtyRowColIds.hasOwnProperty(row) === false ) {
						window.smart_manager.dirtyRowColIds[row] = new Array();
					}

					if( window.smart_manager.dirtyRowColIds[row].indexOf(colIndex) == -1 ) {
						window.smart_manager.dirtyRowColIds[row].push(colIndex);
					}

					if( jQuery('.sm_top_bar_action_btns #save_sm_editor_grid_btn svg').hasClass('sm-ui-state-disabled') ) {
						jQuery('.sm_top_bar_action_btns #save_sm_editor_grid_btn svg').removeClass('sm-ui-state-disabled');
					}

					if( prevClassName == '' || ( typeof(prevClassName) != 'undefined' && prevClassName.indexOf('sm-grid-dirty-cell') == -1 ) ) {

						//creating the edited json string

						if( window.smart_manager.editedData.hasOwnProperty(id) === false ) {
							window.smart_manager.editedData[id] = {};
						}

						if( Object.entries(col).length === 0 ) {
							if( typeof( window.smart_manager.currentColModel ) != 'undefined' ) {
								window.smart_manager.currentColModel.forEach(function(value) {
									if( value.hasOwnProperty('data') && value.data == prop ) {
										col.src = value.src;
									}	
								});
							}
						}

						window.smart_manager.editedData[id][col.src] = newValue;
						window.smart_manager.editedCellIds.push({'row': row, 'col':colIndex});
					}

					if( window.smart_manager.sm_beta_pro == 0 ) {
						if( typeof( window.smart_manager.modifiedRows ) != 'undefined' ) {
							if( window.smart_manager.modifiedRows.length >= window.smart_manager.sm_updated_sucessfull ) {
								//call to function for highlighting selected row ids
								if( typeof( window.smart_manager.disableSelectedRows ) !== "undefined" && typeof( window.smart_manager.disableSelectedRows ) === "function" ) {
									window.smart_manager.disableSelectedRows(true);
								}
							}
						}
					}
				}
			});

			//call to function for highlighting edited cell ids
			if( typeof( window.smart_manager.highlightEditedCells ) !== "undefined" && typeof( window.smart_manager.highlightEditedCells ) === "function" ) {
				window.smart_manager.highlightEditedCells();
			}

			window.smart_manager.hot.render();
		},

		afterOnCellMouseUp: function (e, coords, td) {

			window.smart_manager.selectAll = false
			
			//Code for having checkbox column selection
			if(coords.col === -1){

				//code for handling header checkbox selection
				if(window.smart_manager.hot){
					if(window.smart_manager.hot.selection){
						if(window.smart_manager.hot.selection.highlight){
							if(window.smart_manager.hot.selection.highlight.selectAll){
								window.smart_manager.selectAll = true			
							}
							if(window.smart_manager.hot.selection.highlight.selectedRows){
								window.smart_manager.selectedRows = window.smart_manager.hot.selection.highlight.selectedRows
							}
						}
					}	
				}

				if( typeof( window.smart_manager.enableDisableButtons ) !== "undefined" && typeof( window.smart_manager.enableDisableButtons ) === "function" ) {
					window.smart_manager.enableDisableButtons();
				}
				return;
			}

			let col = this.getCellMeta(coords.row, coords.col);
			if( typeof(col.readOnly) != 'undefined' && col.readOnly == 'true' ) {
				return;
			}
			
			let id_key = ( window.smart_manager.dashboard_key == 'user' ) ? 'users_id' : 'posts_id',
				row_data_id = this.getDataAtRowProp(coords.row, id_key),
				current_cell_value = this.getDataAtCell(coords.row, coords.col),
				params = {'coords': coords,
						'td': td, 
						'colObj': col, 
						'row_data_id': row_data_id, 
						'current_cell_value': current_cell_value};
			
			window.smart_manager.defaultEditor = true;
			jQuery('#sm_editor_grid').trigger('sm_grid_on_afterOnCellMouseUp',[params]);	
			if( window.smart_manager.hasOwnProperty('defaultEditor') && window.smart_manager.defaultEditor === false ) {
				return;
			}

			if( typeof (col.type) != 'undefined' && col.type == 'sm.multipleImage' ) { // code to handle the functionality to handle editing of 'image' data types
			let galleryImages = jQuery( jQuery(td).html() ).data('image-src'),
				imageGalleryHtml = '';

			if( Object.keys( galleryImages ).length > 0 ) {
				if ( typeof (window.smart_manager.generateImageGalleryDlgHtml) !== "undefined" && typeof (window.smart_manager.generateImageGalleryDlgHtml) === "function" ) {
					imageGalleryHtml = window.smart_manager.generateImageGalleryDlgHtml( galleryImages );
				}
			}

			if( Object.entries(col).length === 0 ) {
				if( typeof( window.smart_manager.currentColModel ) != 'undefined' ) {
						window.smart_manager.currentColModel.forEach(function(value) {
							if( value.hasOwnProperty('data') && value.data == col.prop ) {
								col.src = value.src;
							}	
						});
					}
				}

				params = {
							content: imageGalleryHtml,
							target: e,
							modal: true,
							dlg_width: 600,
							title: 'Gallery Images',
							customDataAttributes: { 'data-column': col.src,
													'data-id': row_data_id },
							display_buttons: true,
							buttons_model: [{
												text: 'Add',
												class: 'sm-dlg-btn-yes',
												click: function() {
													if ( typeof (window.smart_manager.handleMediaUpdate) !== "undefined" && typeof (window.smart_manager.handleMediaUpdate) === "function" ) {

														jQuery('.sm_ui_dialog_class, .ui-widget-overlay').hide();

														let params = {	
																		UploaderText: 'Add images to product gallery',
																		UploaderButtonText: 'Add to gallery',
																		allowMultiple: true
																	};

														
															params.callback = function( attachments ) {

																jQuery('.sm_ui_dialog_class , .ui-widget-overlay').show();

																if( typeof( attachments ) == 'undefined' ) {
																	return;
																}

																let imageGalleryHtml = '',
																	modifiedGalleryImages = {};

																jQuery('#sm_inline_dialog').find('img').each( function(){
																	modifiedGalleryImages[ jQuery(this).data('id') ] = jQuery(this).attr('src');
																});

																attachments.forEach( function( attachmentObj ) {
																	modifiedGalleryImages[ attachmentObj.id ] = attachmentObj.sizes.full.url;
																});

																if ( typeof (window.smart_manager.generateImageGalleryDlgHtml) !== "undefined" && typeof (window.smart_manager.generateImageGalleryDlgHtml) === "function" ) {
																	imageGalleryHtml = window.smart_manager.generateImageGalleryDlgHtml( modifiedGalleryImages );
																}

																jQuery('#sm_inline_dialog').html(imageGalleryHtml);

																let updatedGalleryImages = {};
																	updatedGalleryImages[row_data_id] = {};
																	updatedGalleryImages[row_data_id][col.src] = Object.keys( modifiedGalleryImages ).join(',');

																if ( typeof (window.smart_manager.inlineUpdateMultipleImages) !== "undefined" && typeof (window.smart_manager.inlineUpdateMultipleImages) === "function" ) {
																	window.smart_manager.inlineUpdateMultipleImages( updatedGalleryImages );
																}
															}

														window.smart_manager.handleMediaUpdate( params );
													}
												}
											}
									],
						};

				window.smart_manager.inline_edit_dlg(params);
			}

			if( typeof (col.type) != 'undefined' && col.type == 'sm.image' && coords.row >= 0 ) { // code to handle the functionality to handle editing of 'image' data types

				if ( typeof (window.smart_manager.handleMediaUpdate) !== "undefined" && typeof (window.smart_manager.handleMediaUpdate) === "function" ) {

					let params = {};

					// When an image is selected, run a callback.
					params.callback = function( attachment ) {

						if( typeof( attachment ) == 'undefined' ) {
					  		return;
					  	}

						if ( 'postmeta_meta_key__thumbnail_id_meta_value__thumbnail_id' === col.prop ) {

							let params = {};
								params.data = {
												cmd: 'inline_update_product_featured_image',
												active_module: window.smart_manager.dashboard_key,
												pro: ( ( typeof(window.smart_manager.sm_beta_pro) != 'undefined' ) ? window.smart_manager.sm_beta_pro : 0 ),
												product_id: row_data_id,
												update_field: col.prop,
												selected_attachment_id: attachment['id'],
												security: window.smart_manager.sm_nonce
											};

							window.smart_manager.send_request(params, function(response) {
								if ( 'failed' !== response ) {
									window.smart_manager.hot.setDataAtCell(coords.row, coords.col, attachment['url'], 'image_inline_update');

									if( window.smart_manager.isJSON( response ) && ( typeof(window.smart_manager.sm_beta_pro) == 'undefined' || ( typeof(window.smart_manager.sm_beta_pro) != 'undefined' && window.smart_manager.sm_beta_pro != 1 ) ) ) {
										response = JSON.parse( response );
										msg = response.msg;

										if( typeof( response.sm_inline_update_count ) != 'undefined' ) {
											if ( typeof (window.smart_manager.updateLitePromoMessage) !== "undefined" && typeof (window.smart_manager.updateLitePromoMessage) === "function" ) {
												window.smart_manager.updateLitePromoMessage( response.sm_inline_update_count );
											}
										}
									} else {
										msg = response;
									}
								}
							});
						}

					};

					window.smart_manager.handleMediaUpdate( params );
				}
			}

			if( typeof (col.type) != 'undefined' && col.type == 'sm.longstring' ) {

				if( typeof(wp.editor.getDefaultSettings) == 'undefined' ) {
					return;
				}

				//Code for unformatting the 'longstring' type values
				let unformatted_val = current_cell_value;
				let wp_editor_html = '<textarea style="width:100%;height:100%;z-index:100;" id="sm_beta_lonstring_input">'+ unformatted_val +'</textarea>';
				let params = {
							content: wp_editor_html,
							target: window,
							dlg_height: 400,
							dlg_width: 550,
							position_my: 'center center',
							position_at: 'center center',
							modal:true
						};

				window.smart_manager.inline_edit_dlg(params);

				wp.editor.initialize('sm_beta_lonstring_input', {tinymce:  { height: 200,
																			  wpautop:true, 
																			  plugins : 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview', 
																			  toolbar1: 'formatselect bold,italic,strikethrough,|,bullist,numlist,blockquote,|,justifyleft,justifycenter,justifyright,|,link,unlink,wp_more,|,spellchecker,fullscreen,wp_adv',
																			  toolbar2: 'underline,justifyfull,forecolor,|,pastetext,pasteword,removeformat,|,media,charmap,|,outdent,indent,|,undo,redo,wp_help'},
																quicktags:  { buttons: 'strong,em,link,block,del,img,ul,ol,li,code,more,spell,close,fullscreen' },
																mediaButtons: true });

				jQuery(document).off('click', '[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok');
				jQuery(document).on('click', '[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok', function() {
					let content = wp.editor.getContent('sm_beta_lonstring_input');
					window.smart_manager.hot.setDataAtCell(coords.row, coords.col, content, 'sm.longstring_inline_update');
					wp.editor.remove('sm_beta_lonstring_input');
				});

				jQuery(document).off('dialogclose', '[aria-describedby="sm_inline_dialog"]').on('dialogclose', '[aria-describedby="sm_inline_dialog"]', function() {
					wp.editor.remove('sm_beta_lonstring_input');
				});
			}

			if( col.editor == 'sm.serialized' ) { //Code for handling serialized complex data handling

				let wp_editor_html = '<div id="sm_beta_json_editor" style="width: 520px; height: 300px;"></div>';

				let params = {
							content: wp_editor_html,
							target: window,
							dlg_height: 400,
							dlg_width: 550,
							position_my: 'center center',
							position_at: 'center center',
							modal:true
						};

				window.smart_manager.inline_edit_dlg(params);

				let container = document.getElementById("sm_beta_json_editor");
				let options = {
								"mode": 'tree',
								"search": true
							};
				let editor = new JSONEditor(container, options);
				let val = ( window.smart_manager.isJSON(current_cell_value) ) ? JSON.parse(current_cell_value) : current_cell_value;

				if ( col.editor_schema && window.smart_manager.isJSON( col.editor_schema ) ) {
					editor.setSchema( JSON.parse( col.editor_schema ) );
				}

				editor.set(val);
				editor.expandAll();

				jQuery(document).off('click', '[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok');
				jQuery(document).on('click', '[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok', function() {
					let content = JSON.stringify(editor.get());
					window.smart_manager.hot.setDataAtCell(coords.row, coords.col, content, 'sm.serialized_inline_update');
					wp.editor.remove('sm_beta_json_editor');
				});
			}

			if( typeof (col.type) != 'undefined' && col.type == 'sm.multilist' ) { // code to handle the functionality to handle editing of 'multilist' data types

					var actual_value = col.values,
						multiselect_data = new Array(),
						multiselect_chkbox_list = '',
						current_value = new Array();

					if( current_cell_value != '' && typeof(current_cell_value) != 'undefined' && current_cell_value !== null ) {
						current_value = current_cell_value.split(', <br>');
						var rex = /(<([^>]+)>)/ig;

						for(var i in current_value) {
							current_value[i] = current_value[i].replace(rex , "");
						}
					}

					for (var index in actual_value) {

						if (actual_value[index]['parent'] == "0") {

							if (multiselect_data[index] !== undefined) {
								if ( multiselect_data[index].hasOwnProperty('child') !== false ) {
									multiselect_data[index].term = actual_value[index].term;    
								}
								
							} else {
								multiselect_data[index] = {'term' : actual_value[index].term};    
							}

							
						} else {

							if( multiselect_data[actual_value[index]['parent']] === undefined ) {

								//For hirecheal categories
								for (var mindex in multiselect_data) {
									if (multiselect_data[mindex].hasOwnProperty('child') === false) {
										continue;
									}

									for (var cindex in multiselect_data[mindex].child) {

									}

								}

								multiselect_data[actual_value[index]['parent']] = {};
							}

							if (multiselect_data[actual_value[index]['parent']].hasOwnProperty('child') === false) {
								multiselect_data[actual_value[index]['parent']].child = {};
							}
							multiselect_data[actual_value[index]['parent']].term = actual_value[actual_value[index]['parent']].term;
							multiselect_data[actual_value[index]['parent']].child[index] = actual_value[index].term;
						}

					}

					multiselect_data.sort(function(a,b){
						return a.term.localeCompare(b.term);
					})

					multiselect_chkbox_list += '<ul>';

					for (var index in multiselect_data) {

						var checked = '';

						if (current_value != '' && current_value.indexOf(multiselect_data[index].term) != -1) {
							checked = 'checked';                        
						} 

						multiselect_chkbox_list += '<li> <input type="checkbox" name="chk_multiselect" value="'+ index +'" '+ checked +'>  '+ multiselect_data[index].term +'</li>';
						
						if (multiselect_data[index].hasOwnProperty('child') === false) continue;

						var child_val = multiselect_data[index].child;
						multiselect_chkbox_list += '<ul class="children">';

						let childValKeys = Object.keys(multiselect_data[index].child);

						childValKeys.sort(function(a,b){
							return child_val[a].localeCompare(child_val[b]);
						})

						childValKeys.map(function(key) {
							var child_checked = '';

							if (current_value != '' && current_value.indexOf(child_val[key]) != -1) {
								child_checked = 'checked';                        
							} 

							multiselect_chkbox_list += '<li> <input type="checkbox" name="chk_multiselect" value="'+ key +'" '+ child_checked +'>  '+ child_val[key] +'</li>';
						});
						
						multiselect_chkbox_list += '</ul>';
					}               

					multiselect_chkbox_list += '</ul>';

				
				params = {
							content: multiselect_chkbox_list,
							target: e,
							modal: true
						};

				window.smart_manager.inline_edit_dlg(params);

				//Code for click event of 'ok' btn
				jQuery(document).off('click','[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok').on('click', '[aria-describedby="sm_inline_dialog"] .sm_inline_dialog_ok', function() {

					var mutiselect_edited_text = '';

					var selected_val = jQuery("[aria-describedby='sm_inline_dialog'] input[name='chk_multiselect']:checked" ).map(function () {
											return jQuery(this).val();
										}).get();

					if( selected_val.length > 0 ) {

						for (var index in selected_val) {
							if( actual_value.hasOwnProperty(selected_val[index]) ) {
								if (mutiselect_edited_text != '') {
									mutiselect_edited_text += ', <br>';
								}
								mutiselect_edited_text += actual_value[selected_val[index]]['term'];
							}
						}

						if( mutiselect_edited_text != '' ) {
							window.smart_manager.hot.setDataAtCell(coords.row, coords.col, mutiselect_edited_text, 'sm.multilist_inline_update');
						}

					}
				});
			}
		}
	});
}

Smart_Manager.prototype.reset = function( fullReset = false ){
	
	if(fullReset){
		window.smart_manager.currentDashboardModel = '';
		window.smart_manager.currentVisibleColumns = [];
		window.smart_manager.column_names = [];
		window.smart_manager.simpleSearchText = '';
		window.smart_manager.advancedSearchQuery = new Array();
	}

	window.smart_manager.currentDashboardData = [];
	
	window.smart_manager.selectedRows = [];
	window.smart_manager.selectAll = false;
	window.smart_manager.addRecords_count = 0;
	window.smart_manager.page = 1;
	window.smart_manager.dirtyRowColIds = {};
	window.smart_manager.editedData = {};

	if(window.smart_manager.hot){
		if(window.smart_manager.hot.selection){
			if(window.smart_manager.hot.selection.highlight){
				if(window.smart_manager.hot.selection.highlight.selectAll){
					delete window.smart_manager.hot.selection.highlight.selectAll
				}
				window.smart_manager.hot.selection.highlight.selectedRows = []
			}
		}
	}
}

Smart_Manager.prototype.refresh = function( dataParams ) {
	window.smart_manager.reset();

	if( window.smart_manager.sm_beta_pro == 0 ) {
		if( typeof( window.smart_manager.disableSelectedRows ) !== "undefined" && typeof( window.smart_manager.disableSelectedRows ) === "function" ) {
			window.smart_manager.disableSelectedRows(false);
		}
	}

	window.smart_manager.getData(dataParams);
}

Smart_Manager.prototype.event_handler = function() {

	// Code to handle width of the grid based on the WP collapsable menu
	jQuery(document).on('click', '#collapse-menu', function() {
		let current_url = document.URL;

		if ( current_url.indexOf("page=smart-manager") == -1 ) {
			return;
		}

		if ( !jQuery(document.body).hasClass('folded') ) {
			window.smart_manager.grid_width = document.documentElement.offsetWidth - (document.documentElement.offsetWidth * 0.10);
		} else {
			window.smart_manager.grid_width = document.documentElement.offsetWidth - (document.documentElement.offsetWidth * 0.04);
		}
		
		window.smart_manager.hot.updateSettings({'width':window.smart_manager.grid_width});
		window.smart_manager.hot.render();

		jQuery('#sm_top_bar, #sm_bottom_bar').css('width',window.smart_manager.grid_width+'px');
		jQuery('#sm_top_bar_actions').css('width',window.smart_manager.grid_width+'px');
		jQuery('#sm_top_bar_left').css('width','calc('+ window.smart_manager.grid_width +'px - 2em');
	});

	//Code to handle dashboard change in grid
	jQuery(document).off('change', '#sm_dashboard_select').on('change', '#sm_dashboard_select',function(){

		var sm_dashboard_valid = 0,
			sm_selected_dashboard_key = jQuery(this).val(),
			sm_selected_dashboard_title = jQuery( "#sm_dashboard_select option:selected" ).text();

		if( window.smart_manager.sm_beta_pro == 0 ) {
			sm_dashboard_valid = 0;
			if( window.smart_manager.sm_lite_dashboards.indexOf(sm_selected_dashboard_key) >= 0 ) {
				sm_dashboard_valid = 1;    
			}
		} else {
			sm_dashboard_valid = 1;
		}

		if( sm_dashboard_valid == 1 ) {

			window.smart_manager.state_apply = true;
			// window.smart_manager.refreshDashboardStates(); //function to save the state
			
			if ( typeof (window.smart_manager.updateState) !== "undefined" && typeof (window.smart_manager.updateState) === "function" ) {
				window.smart_manager.updateState(); //refreshing the dashboard states
			}
			
			window.smart_manager.reset(true);

			window.smart_manager.dashboard_key = sm_selected_dashboard_key;
			window.smart_manager.dashboardName = sm_selected_dashboard_title;
			window.smart_manager.current_selected_dashboard = sm_selected_dashboard_key;
		
			window.smart_manager.setDashboardDisplayName();

			content = ( window.smart_manager.searchType == 'simple' ) ? window.smart_manager.simpleSearchContent : window.smart_manager.advancedSearchContent;
			jQuery('#sm_nav_bar_search #search_content').html(content);

			if ( typeof (window.smart_manager.initialize_advanced_search) !== "undefined" && typeof (window.smart_manager.initialize_advanced_search) === "function" && window.smart_manager.searchType != 'simple' ) {
				window.smart_manager.initialize_advanced_search();
			}

			if ( window.smart_manager.dashboard_key == 'shop_order' ) {
				jQuery('#print_invoice_sm_editor_grid_btn').show();
			} else {
				jQuery('#print_invoice_sm_editor_grid_btn').hide();
			}

			if( window.smart_manager.sm_beta_pro == 1 ) {
				let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);
				if(viewSlug){
					jQuery('#show_hide_cols_sm_editor_grid').hide();	
				} else {
					jQuery('#show_hide_cols_sm_editor_grid').show();
				}
			} else {
				jQuery('#show_hide_cols_sm_editor_grid').show();
			}

			jQuery('#sm_editor_grid').trigger( 'sm_dashboard_change' ); //custom trigger

			window.smart_manager.load_dashboard(); 
		} else {
			jQuery(this).val(window.smart_manager.current_selected_dashboard);

			var content = 'For managing '+ sm_selected_dashboard_title +', '+ window.smart_manager.sm_success_msg + ' <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">Pro</a> version.';
			window.smart_manager.showNotification( 'Note', content, {autoHide: false} );
		}
		
	})
	
	.off( 'change', '#search_switch').on( 'change', '#search_switch' ,function(){ //request for handling switch search types

		let switchSearchType = jQuery(this).attr('switchSearchType'),
			title = jQuery("label[for='"+ jQuery(this).attr("id") +"']").attr('title'),
			content = '';

		if(window.smart_manager.clearSearchOnSwitch){
			window.smart_manager.advancedSearchQuery = new Array();
			window.smart_manager.simpleSearchText = '';
		}

		jQuery(this).attr('switchSearchType', window.smart_manager.searchType);
		jQuery("label[for='"+ jQuery(this).attr("id") +"']").attr('title', title.replace(String(switchSearchType).capitalize(), String(window.smart_manager.searchType).capitalize()));

		window.smart_manager.searchType = switchSearchType;
		content = ( window.smart_manager.searchType == 'simple' ) ? window.smart_manager.simpleSearchContent : window.smart_manager.advancedSearchContent;
		
		jQuery('#sm_nav_bar_search #search_content').html(content);

		if ( typeof (window.smart_manager.initialize_advanced_search) !== "undefined" && typeof (window.smart_manager.initialize_advanced_search) === "function" && window.smart_manager.searchType != 'simple' ) {
			window.smart_manager.initialize_advanced_search();
		}

	})

	.off( 'keyup', '#sm_simple_search_box').on( 'keyup', '#sm_simple_search_box' ,function(){ //request for handling simple search
		clearTimeout(window.smart_manager.searchTimeoutId);
		window.smart_manager.searchTimeoutId = setTimeout(function () {
			window.smart_manager.simpleSearchText = jQuery('#sm_simple_search_box').val();
			window.smart_manager.refresh();
		}, 1000);
	})

	.off( 'click', '#sm_advanced_search_submit').on( 'click', '#sm_advanced_search_submit' ,function(){ //request for handling advanced search

		jQuery('input[id^="sm_advanced_search_box_"]').each(function() {

			var val = jQuery(this).val();

			if( val.length == 0 ) {
				var id = jQuery(this).attr('id'),
					index = id.lastIndexOf("_"),
					key = id.substr(index+1);    

				delete(window.smart_manager.advancedSearchQuery[key]);
			}
			
		});

		window.smart_manager.load_dashboard();
		
	})

	//Code to handle the inline save functionality
	.off( 'click', '.sm_top_bar_action_btns #save_sm_editor_grid_btn').on( 'click', '.sm_top_bar_action_btns #save_sm_editor_grid_btn' ,function(){

		if( Object.getOwnPropertyNames(window.smart_manager.editedData).length > 0 ) {

			if ( typeof (window.smart_manager.saveData) !== "undefined" && typeof (window.smart_manager.saveData) === "function" ) {
				window.smart_manager.saveData();    
			};
		} else {
			window.smart_manager.showNotification('', 'Please edit a record');
		}

		return false;    

	})

	//Code to handle the delete records functionality
	.off( 'click', '.sm_top_bar_action_btns #sm_beta_move_to_trash, .sm_top_bar_action_btns #sm_beta_delete_permanently').on( 'click', '.sm_top_bar_action_btns #sm_beta_move_to_trash, .sm_top_bar_action_btns #sm_beta_delete_permanently' ,function(){

		let id = jQuery(this).attr('id');

		let deletePermanently = ( 'sm_beta_delete_permanently' == id ) ? 1 : 0;

		if( 0 == window.smart_manager.sm_beta_pro && deletePermanently ) {
			window.smart_manager.showNotification('', 'To permanently delete records, <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">upgrade to Pro</a>');			
			return false;
		}

		if( deletePermanently && window.smart_manager.deletePermanently.disable ) {
			window.smart_manager.showNotification('', window.smart_manager.deletePermanently.error_message, {autoHide: false});
			return false;
		}
			
		if( window.smart_manager.selectedRows.length == 0 && !window.smart_manager.selectAll ) {
			window.smart_manager.showNotification('', 'Please select a record');
			return false;
		}

		if ( window.smart_manager.sm_beta_pro == 0 && window.smart_manager.selectedRows.length > window.smart_manager.sm_deleted_sucessfull ) {
			window.smart_manager.showNotification('', 'To delete more than '+window.smart_manager.sm_deleted_sucessfull+' records at a time, <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">upgrade to Pro</a>');
		} else {	

			let params = {};

			params.title       = '<span class="sm-error-icon"><span class="dashicons dashicons-warning" style="vertical-align: text-bottom;"></span>&nbsp;Attention!!!</span>';
			params.titleIsHtml = true;
			params.btnParams   = {};

			let actionText = ( !window.smart_manager.trashEnabled || deletePermanently ) ? '<span class="sm-error-icon">permanently delete</span>' : 'trash'; 

			if( !window.smart_manager.trashEnabled || deletePermanently ) {
				params.height = 170;
			}

			let selected_text = '<span style="font-size: 1.2em;">Are you sure you want to <strong>'+ actionText +' the selected</strong> ' + ( ( window.smart_manager.selectedRows.length > 1 ) ? 'records' : 'record' ) + '?</span>';
			let all_text      = '<span style="font-size: 1.2em;">Are you sure you want to <strong>'+ actionText +' all</strong> the ' + window.smart_manager.dashboardDisplayName + '?</span>';

			params.btnParams.yesCallbackParams = {};

			if ( window.smart_manager.sm_beta_pro == 1 ) {
				params.btnParams.yesCallbackParams = { 'deletePermanently': deletePermanently };

				if ( true === window.smart_manager.selectAll ) {
					params.content = all_text;
				} else {
					params.content = selected_text;
				}

				if ( typeof (window.smart_manager.deleteAllRecords) !== "undefined" && typeof (window.smart_manager.deleteAllRecords) === "function" ) {
					params.btnParams.yesCallback = window.smart_manager.deleteAllRecords;
				}
			} else {
				if ( typeof (window.smart_manager.deleteRecords) !== "undefined" && typeof (window.smart_manager.deleteRecords) === "function" ) {
					params.content = selected_text;
					if ( true === window.smart_manager.selectAll ) {
						params.content += '<br><br><br><span style="font-size: 1.2em;"><small><i>Note: Looking to <strong>delete all</strong> the records? <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">Upgrade to Pro</a></i></small></span>';
						params.height = 225;
					}
					params.btnParams.yesCallback = window.smart_manager.deleteRecords;
				}
			}
			window.smart_manager.showConfirmDialog(params);
		}
		return false;    
	})

	//Code for handling refresh event
	.off( 'click', ".sm_gallery_image .sm_gallery_image_delete").on( 'click', ".sm_gallery_image .sm_gallery_image_delete", function(){
		jQuery(this).parents('.sm_gallery_image').remove();

		let imageIds = new Array();

		jQuery('#sm_inline_dialog').find('img').each( function(){
			imageIds.push( jQuery(this).data('id') );
		});

		let updatedGalleryImages = {},
			colSrc = jQuery('#sm_inline_dialog').data('column'),
			updateId = jQuery('#sm_inline_dialog').data('id');

		updatedGalleryImages[updateId] = {};
		updatedGalleryImages[updateId][colSrc] = imageIds.join(',');

	  	if ( typeof (window.smart_manager.inlineUpdateMultipleImages) !== "undefined" && typeof (window.smart_manager.inlineUpdateMultipleImages) === "function" ) {
			window.smart_manager.inlineUpdateMultipleImages( updatedGalleryImages );
		}
	})
	

	//Code for handling refresh event
	.off( 'click', "#refresh_sm_editor_grid").on( 'click', "#refresh_sm_editor_grid", function(){
		window.smart_manager.refresh();
	})

	.off( 'click', "#sm_editor_grid_distraction_free_mode").on( 'click', "#sm_editor_grid_distraction_free_mode", function(){

		if ( window.smart_manager.sm_beta_pro == 1 ) {
			if ( typeof (window.smart_manager.smToggleFullScreen) !== "undefined" && typeof (window.smart_manager.smToggleFullScreen) === "function" ) {
				let element = document.documentElement;
				window.smart_manager.smToggleFullScreen( element );    
			}
		} else {
			window.smart_manager.showNotification();
		}
		
/*Review*/
		window.smart_manager.hot.updateSettings({'width':window.smart_manager.grid_width});
		window.smart_manager.hot.render();

		jQuery('#sm_top_bar, #sm_bottom_bar').css('width',window.smart_manager.grid_width+'px');
	})

	//Code for load more items
	.off( 'click', "#sm_editor_grid_load_items").on( 'click', "#sm_editor_grid_load_items", function(){

		if( window.smart_manager.currentDashboardData.length >= window.smart_manager.totalRecords ) {
			return;
		}

		window.smart_manager.page++;
		window.smart_manager.getData();
	})

	.off( 'click', 'td.htDimmed' ).on( 'click', 'td.htDimmed' , function() {
		if( window.smart_manager.sm_beta_pro == 0 ) {
			if( typeof( window.smart_manager.modifiedRows ) != 'undefined' ) {
				if( window.smart_manager.modifiedRows.length >= window.smart_manager.sm_updated_sucessfull ) {
					alert('For editing more records upgrade to Pro');
				}
			}
		}
	})

	//Code for add record functionality
	.off( 'click', "#add_sm_editor_grid").on( 'click', "#add_sm_editor_grid", function(){

		let params = {
						title : 'Add '+window.smart_manager.dashboardDisplayName+'(s)',
						content : '<div style="font-size:1.2em;margin:1em;"> <div style="margin-bottom:1em;">Enter how many new '+ window.smart_manager.dashboardDisplayName +'(s) to create! </div> <input type="number" id="sm_beta_add_record_count" min="1" value="1" style="width:5em;"></div>',
						height : 250,
						btnParams : { yesText : 'Create',
										noText : 'Cancel' }
					};
		
		if ( typeof (window.smart_manager.deleteRecords) !== "undefined" && typeof (window.smart_manager.deleteRecords) === "function" ) {
			params.btnParams.yesCallback = function() {
				let count = jQuery('#sm_beta_add_record_count').val();
				if( count > 0 ) {
					window.smart_manager.hot.alter('insert_row', 0, count);
				}
			};
		}

		window.smart_manager.showConfirmDialog(params);
	})

	.off('click', "#sm_custom_views_create, #sm_custom_views_update").on('click', "#sm_custom_views_create, #sm_custom_views_update", function(e){
		e.preventDefault();
		if( window.smart_manager.sm_beta_pro == 1 ) {
			if ( typeof (window.smart_manager.createUpdateViewDialog) !== "undefined" && typeof (window.smart_manager.createUpdateViewDialog) === "function" ) {
				let id = jQuery(this).attr('id');
				let action = (id == 'sm_custom_views_update') ? 'update' : 'create';
				window.smart_manager.createUpdateViewDialog(action);
			}
		}  else {
			window.smart_manager.showNotification('Custom Views avialable (Only in <a href="'+ window.smart_manager.pricingPageURL +'" target="_blank">Pro</a>)');
		}
		
	})

	.off('click', "#sm_custom_views_delete").on('click', "#sm_custom_views_delete", function(e){
		e.preventDefault();
		if( window.smart_manager.sm_beta_pro == 1 ) {
			let params = {};

			params.btnParams = {}
			params.title = '<span class="sm-error-icon"><span class="dashicons dashicons-warning" style="vertical-align: text-bottom;"></span>&nbsp;Attention!!!</span>';
			params.content = '<span style="font-size: 1.2em;">This will <span class="sm-error-icon"><strong>delete</strong></span> the current view. Are you sure you want to continue?</span>';
			params.titleIsHtml = true;
			params.height = 200;

			if ( typeof (window.smart_manager.deleteView) !== "undefined" && typeof (window.smart_manager.deleteView) === "function" ) {
				params.btnParams.yesCallback = window.smart_manager.deleteView;
			}
			
			window.smart_manager.showConfirmDialog(params);
		}  else {
			window.smart_manager.showNotification('Custom Views avialable (Only in <a href="'+ window.smart_manager.pricingPageURL +'" target="_blank">Pro</a>)');
		}
	})

	// Code for handling the batch update & duplicate records functionality
	.off( 'click', "#batch_update_sm_editor_grid, .sm_top_bar_action_btns .sm_beta_dropdown_content a, #export_csv_sm_editor_grid, #print_invoice_sm_editor_grid_btn").on( 'click', "#batch_update_sm_editor_grid, .sm_top_bar_action_btns .sm_beta_dropdown_content a, #export_csv_sm_editor_grid, #print_invoice_sm_editor_grid_btn", function(){

		let id = jQuery(this).attr('id'),
			btnText = jQuery(this).text();

		if( typeof( id ) != 'undefined' && ( 'sm_beta_move_to_trash' == id || 'sm_beta_delete_permanently' == id ) ) {
			return;
		}

		if( window.smart_manager.sm_beta_pro == 1 ) {

			if( typeof( id ) != 'undefined' ) {
				if( id == 'export_csv_sm_editor_grid' ) { //code for handling export CSV functionality
					if ( typeof (window.smart_manager.generateCsvExport) !== "undefined" && typeof (window.smart_manager.generateCsvExport) === "function" ) {
						window.smart_manager.generateCsvExport();    
					}
				} else {
					if( window.smart_manager.selectedRows.length > 0 || window.smart_manager.selectAll ) {

						let isBackgroundProcessRunning = false;

						if( typeof (window.smart_manager.isBackgroundProcessRunning) !== "undefined" && typeof (window.smart_manager.isBackgroundProcessRunning) === "function" ) {
							isBackgroundProcessRunning = window.smart_manager.isBackgroundProcessRunning();
						}

						if( isBackgroundProcessRunning && ( id == 'batch_update_sm_editor_grid' || id == 'sm_beta_dup_entire_store' || id == 'sm_beta_dup_selected' ) ) {
							let dlgParams = { height: 160, width: 800, autoHide:false };
							window.smart_manager.showNotification( '', window.smart_manager.backgroundProcessRunningMessage, dlgParams );
						}

						if( id == 'batch_update_sm_editor_grid' && !isBackgroundProcessRunning ) { //code for handling batch update functionality
							window.smart_manager.createBatchUpdateDialog();
						} else if( ( id == 'sm_beta_dup_entire_store' || id == 'sm_beta_dup_selected' ) && !isBackgroundProcessRunning ) { //code for handling duplicate records functionality

							let params = {};

							params.btnParams = {}
							params.title = 'Attention!!!';
							params.content = (window.smart_manager.dashboard_key != 'product') ? '<p>This will duplicate only the records in posts, postmeta and related taxonomies.</p>' : '';
							params.content += 'Are you sure you want to duplicate the ' + btnText + '?';

							if ( typeof (window.smart_manager.duplicateRecords) !== "undefined" && typeof (window.smart_manager.duplicateRecords) === "function" ) {
								params.btnParams.yesCallback = window.smart_manager.duplicateRecords;
							}
							
							window.smart_manager.duplicateStore = ( id == 'sm_beta_dup_entire_store' ) ? true : false;

							window.smart_manager.showConfirmDialog(params);
						} else if( id == 'print_invoice_sm_editor_grid_btn' ) { //code for handling Print Invoice functionality
							if ( typeof (window.smart_manager.printInvoice) !== "undefined" && typeof (window.smart_manager.printInvoice) === "function" ) {
								window.smart_manager.printInvoice();
							}
						}

					} else {
						window.smart_manager.showNotification('', 'Please select a record');
					}
				}
			}
			
		} else {

			if( typeof(id) != 'undefined' ) {


				if( id != 'sm_beta_dup_entire_store' && id != 'sm_beta_dup_selected' ) {
					
					let description = 'You can change / update multiple fields of the entire store OR for selected items by selecting multiple records and then click on Bulk Edit.';

					if( id == 'export_csv_sm_editor_grid' ) {
						description = 'You can export all the records OR filtered records (using Simple Search or Advanced Search) by simply clicking on the Export CSV button at the bottom right of the grid.';
					}

					content = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ ( ( id == 'batch_update_sm_editor_grid' ) ? 'COXCuX2rFrk' : 'GMgysSQw7_g' ) +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'+
								'<p style="font-size:1.2em;margin:1em;">'+description+'</p>';

					title = ( ( id == 'batch_update_sm_editor_grid' ) ? btnText + ' - <span style="color: red;">Biggest Time Saver</span>' : btnText ) + ' (Only in <a href="'+ window.smart_manager.pricingPageURL +'" target="_blank">Pro</a>) ';

					let params = {
									title: title,
									content: content,
									target: window,
									dlg_height: 570,
									dlg_width: 600,
									position_my: 'center center',
									position_at: 'center center',
									modal:true,
									titleIsHtml: true,
									buttons_model: [{
										text: 'Get Pro at 25% OFF',
										class: 'sm_button green',
										click: function() {
											window.open(window.smart_manager.pricingPageURL, "_blank");
											jQuery( this ).dialog( "close" );
										}
									}],
								};

					window.smart_manager.inline_edit_dlg(params);
				} else {
					window.smart_manager.showNotification('Duplicate Records (Only in <a href="'+ window.smart_manager.pricingPageURL +'" target="_blank">Pro</a>)');
				}
			} else {
				window.smart_manager.showNotification();
			}
		}
	})

	//Code for handling adding advanced search conditions
	.off('click', '#sm_advanced_search_or').on('click', '#sm_advanced_search_or', function () {
		if( window.smart_manager.sm_beta_pro == 1 ) { 
			jQuery("#sm_advanced_search_or").removeAttr('disabled');
			if ( typeof window.smart_manager.addAdvancedSearchCondition !== "undefined" && typeof window.smart_manager.addAdvancedSearchCondition === "function" ) {
				window.smart_manager.addAdvancedSearchCondition();    
			}
			
		} else {
			jQuery("#sm_advanced_search_or").attr('disabled','disabled');
			window.smart_manager.showNotification();
		}
	})

	//Code for handling adding advanced search conditions
	.off('click', '#show_hide_cols_sm_editor_grid').on('click', '#show_hide_cols_sm_editor_grid', function () {
		if ( typeof (window.smart_manager.createColumnVisibilityDialog) !== "undefined" && typeof (window.smart_manager.createColumnVisibilityDialog) === "function" ) {
			window.smart_manager.createColumnVisibilityDialog();
		}
	})

	.off('mouseover', '#sm_inline_dialog > .sm_gallery_image > img').on('mouseover','#sm_inline_dialog > .sm_gallery_image > img', function(e){
		
		let params = {
						'current_cell_value': jQuery(this).attr('src'),
						'event': e,
						'title': ''
					};

		if( typeof( window.smart_manager.showImagePreview ) !== "undefined" && typeof( window.smart_manager.showImagePreview ) === "function" ) {
			window.smart_manager.showImagePreview(params);
		}

	})

	.off('mouseout', '#sm_inline_dialog > .sm_gallery_image > img').on('mouseout','#sm_inline_dialog > .sm_gallery_image > img', function(e){
		
		if( jQuery('#sm_img_preview').length > 0 ) {
			jQuery('#sm_img_preview').remove();
		}

	})

	//Code for handling the dropdown menu for the duplicate button
	.off('mouseenter', '.sm_beta_dropdown').on('mouseenter','.sm_beta_dropdown', function(){
		jQuery(this).find('.sm_beta_dropdown_content').show();
	})

	//Code for handling the dropdown menu for the duplicate button
	.off('mouseleave', '.sm_beta_dropdown').on('mouseleave','.sm_beta_dropdown', function(){
		jQuery(this).find('.sm_beta_dropdown_content').hide();
	})

	.off("click", ".sm_click_to_copy").on("click", ".sm_click_to_copy", function() {
		let temp = jQuery("<input>");
		  jQuery("body").append(temp);
		  temp.val(jQuery(this).html()).select();
		  document.execCommand("copy");
		  temp.remove();
	});

	jQuery(document).trigger('sm_event_handler');

}

//Function to equalize the enabled and disabled section height in column visibility dialog
Smart_Manager.prototype.columnVisibilityEqualizeHeight = function() {
	let enabledHeight = jQuery('#sm-columns-enabled').height(),
		disabledHeight = jQuery('#sm-columns-disabled').height(),
		maxHeight = enabledHeight > disabledHeight ? enabledHeight : disabledHeight;

	if( maxHeight > 0 ) {
		jQuery('#sm-columns-enabled, #sm-columns-disabled').height(maxHeight);
	}
}

//Function to process Column Visibility Enabled & Disabled Columns Search
Smart_Manager.prototype.processColumnVisibilitySearch = function(eventObj) {
	
	let searchString = jQuery(eventObj).val(),
		ulId = jQuery(eventObj).attr('data-ul-id');
	
	if( ulId != '' ) {
		jQuery("#"+ulId).find('li').each( function() {
			let txtValue = jQuery(this).text();
			if (txtValue.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
		      jQuery(this).show();
		    } else {
		      jQuery(this).hide();
		    }
		});
	}
}

//Function to create column Visibility dialog
Smart_Manager.prototype.createColumnVisibilityDialog = function() {

	let enabledColumnsArray = new Array(),
		hiddenColumnsArray = new Array(),
		colText = '',
		colVal = '',
		temp = '',
		dlgParams = {},
		dlgContent = '';

	for( let key in window.smart_manager.currentColModel ) {

		colObj = window.smart_manager.currentColModel[key];

		if( ! colObj.hasOwnProperty('data') ) {
			continue;
		}

		if( colObj.hasOwnProperty('allow_showhide') && colObj.allow_showhide === true ) {

			colText = ( colObj.hasOwnProperty('name_display') ) ? colObj.name_display : '';
			colVal = ( colObj.hasOwnProperty('data') ) ? colObj.data : '';
			colPosition = ( colObj.hasOwnProperty('position') ) ? ( ( colObj.position != '' ) ? colObj.position - 1 : '' ) : '';


			temp = '<li><span class="handle">::</span> '+ colText + ' ' +
						'<input type="hidden" name="columns[]" class="js-column-key" value="'+ colVal +'"> '+
						'<input type="hidden" name="columns_names[]" class="js-column-title" value="'+ colText +'"> '+
					'</li>';

			if( colObj.hasOwnProperty('hidden') && colObj.hidden === false ) {
				enabledColumnsArray.push(temp);
			} else if( colObj.hasOwnProperty('hidden') && colObj.hidden === true ) {
				hiddenColumnsArray.push(temp);
			}
		} 
	}

	dlgContent = '<form id="sm-column-visibility"> '+
					'<ul class="unstyled-list"> '+
						'<li> '+
							'Drag & drop the enabled columns to the right side to disable them. Drag & drop the disabled columns to the left side to disable them.'+
						'</li> '+
						'<li> '+
							'Drag the columns to the top or bottom to sort them.'+
						'</li> '+
						'<li> '+
							'<div class="sm-sorter-section"> '+
								'<h3>Enabled</h3> '+
								'<input type="text" id="searchEnabledColumns" data-ul-id="sm-columns-enabled" class="sm-search-box" onkeyup="window.smart_manager.processColumnVisibilitySearch(this)" placeholder="Search For Enabled Columns..."> '+
								'<ul class="sm-sorter columns-enabled" id="sm-columns-enabled"> '+
									enabledColumnsArray.join("") +
								'</ul> '+
							'</div> '+
							'<div class="sm-sorter-section"> '+
								'<h3>Disabled</h3> '+
								'<input type="text" id="searchDisabledColumns" data-ul-id="sm-columns-disabled" class="sm-search-box" onkeyup="window.smart_manager.processColumnVisibilitySearch(this)" placeholder="Search For Disabled Columns..."> '+
								'<ul class="sm-sorter columns-disabled" id="sm-columns-disabled"> '+
									hiddenColumnsArray.join("") +
								'</ul> '+
							'</div> '+
						'</li> '+
					'</ul> '+
					'<input type="hidden" value="" id="sm-all-enabled-columns"> '+
				'</form> ';

	dlgParams.btnParams = {};
	dlgParams.btnParams.yesText = 'Update';
	if ( typeof (window.smart_manager.processColumnVisibility) !== "undefined" && typeof (window.smart_manager.processColumnVisibility) === "function" ) {
		dlgParams.btnParams.yesCallback = window.smart_manager.processColumnVisibility;
	}

	dlgParams.title = 'Column Manager - Show/Hide Columns';
	dlgParams.content = dlgContent;
	dlgParams.height = 600;
	dlgParams.width = 700;

	window.smart_manager.showConfirmDialog(dlgParams);

	if ( typeof (window.smart_manager.columnVisibilityEqualizeHeight) !== "undefined" && typeof (window.smart_manager.columnVisibilityEqualizeHeight) === "function" ) {
		window.smart_manager.columnVisibilityEqualizeHeight();
	}

	let $columns = document.getElementById('sm-columns-enabled'),
		$columnsDisabled = document.getElementById('sm-columns-disabled');

	window.smart_manager.enabledSortable = Sortable.create($columns, {
		group: 'smartManagerColumns',
		animation: 100,
		onSort: function (evt) {
			if ( typeof (window.smart_manager.columnsMoved) !== "undefined" && typeof (window.smart_manager.columnsMoved) === "function" ) {
				window.smart_manager.columnsMoved();
			}
		}
	});
	window.smart_manager.disabledSortable = Sortable.create($columnsDisabled, {
		group: 'smartManagerColumns',
		animation: 100
	});
}

//Function to update the list of enabled columns on column move event
Smart_Manager.prototype.columnsMoved = function() {
	let enabled = jQuery('#sm-column-visibility').find('.columns-enabled .js-column-key');
	let allEnabled = enabled.map(function () {
		return jQuery(this).val();
	}).get().join(',');
	jQuery('#sm-column-visibility').find('#sm-all-enabled-columns').val(allEnabled);
	window.smart_manager.columnsVisibilityUsed = true;
}

//Function to load the updated list of enabled columns in the grid
Smart_Manager.prototype.processColumnVisibility = function() {
	if( window.smart_manager.columnsVisibilityUsed === false ) {
		return false;
	}

	let enabledColumns = jQuery('#sm-column-visibility').find('#sm-all-enabled-columns').val();

	if( typeof enabledColumns == 'undefined' || typeof window.smart_manager.currentColModel == 'undefined' ) {
		return;
	}

	window.smart_manager.showLoader();

	if( enabledColumns.length > 0 ) {

		// let idKey = ( window.smart_manager.dashboard_key == 'user' ) ? 'users_id' : 'posts_id';
        	// enabledColumns = idKey + ',' + enabledColumns;

		let enabledColumnsArray = enabledColumns.split(','),
			colVal = '',
			position = 0,
			index = 0;

		window.smart_manager.column_names = [];
		window.smart_manager.currentVisibleColumns = [];

		for( let key in window.smart_manager.currentColModel ) {

			colObj = window.smart_manager.currentColModel[key];

			if( colObj.hasOwnProperty('allow_showhide') && colObj.allow_showhide === true ) {
				colVal = ( colObj.hasOwnProperty('data') ) ? colObj.data : '';

				if( enabledColumnsArray.indexOf(colVal) != -1 ) {

					position = enabledColumnsArray.indexOf(colVal)+1;

					window.smart_manager.currentColModel[key].hidden = false; //Code for refreshing the column visibility
					window.smart_manager.currentColModel[key].position = position; //Code for refreshing the column position

				} else {
					window.smart_manager.currentColModel[key].hidden = true;
				}
			}
		}

		if ( typeof (window.smart_manager.sortColumns) !== "undefined" && typeof (window.smart_manager.sortColumns) === "function" ) {
			window.smart_manager.sortColumns();
		}

		window.smart_manager.currentColModel.forEach(function(colObj){

			let hidden = ( typeof(colObj.hidden) != 'undefined' ) ? colObj.hidden : true;

			if( hidden === false ) {
				if(colObj.hasOwnProperty('name_display') === false) {// added for state management
					colObj.name_display = name;
				}
				let name = (typeof(colObj.name) != 'undefined') ? colObj.name.trim() : '';

				window.smart_manager.column_names[index] = colObj.name_display; //Array for column headers
				window.smart_manager.currentVisibleColumns[index] = colObj;

				index++;
			}
		});

		if ( typeof (window.smart_manager.updateState) !== "undefined" && typeof (window.smart_manager.updateState) === "function" ) {
			let params = { refreshDataModel : true, async: false };
			window.smart_manager.isColumnModelUpdated = true
			window.smart_manager.updateState(params); //refreshing the dashboard states
		}

		setTimeout( function() { window.smart_manager.showLoader(false) }, 10);
	}
}

//Function to sort the columns in the current_col_model based on the 'position' key
Smart_Manager.prototype.sortColumns = function() {

	if( typeof window.smart_manager.currentColModel == 'undefined' ) {
		return;
	}

	window.smart_manager.indexPointer = 0;

	let enabledColumns = new Array(),
		disabledColumns = new Array();
		enabledColumnsFinal = new Array();

	window.smart_manager.currentColModel.forEach(function(colObj){
		enabled = 0;

		if( colObj.hasOwnProperty('position') != false && colObj.hasOwnProperty('hidden') != false ) {
			if( colObj.position != '' && colObj.hidden === false ) {
				enabledColumns[ colObj.position ] = colObj;
				enabled = 1;
			}
		}

		if( enabled == 0 ) {
			disabledColumns.push(colObj);
		}
	});

	enabledColumns.forEach(function(colObj){ //done this to re-index the array for proper array length
		enabledColumnsFinal.push(colObj);
	});

	enabledColumnsFinal.sort(function(a, b) {
		return parseInt(a.position) - parseInt(b.position);
	});

	window.smart_manager.currentColModel = enabledColumnsFinal.concat(disabledColumns);
}

//Function to get the seleted IDs
Smart_Manager.prototype.getSelectedKeyIds = function() {
	let idKey = ( window.smart_manager.dashboard_key == 'user' ) ? 'users_id' : 'posts_id',
		selectedIds = [];	
	window.smart_manager.selectedRows.forEach((rowId) => {
		selectedIds.push(window.smart_manager.currentDashboardData[rowId][idKey]);
	})

	return selectedIds;
}


//Function to delete records
Smart_Manager.prototype.deleteRecords = function() {

	if( window.smart_manager.selectedRows.length == 0 && !window.smart_manager.selectAll ) {
		return;
	}

	let params = {};
		params.data = {
						cmd: 'delete',
						active_module: window.smart_manager.dashboard_key,
						security: window.smart_manager.sm_nonce,
						ids: JSON.stringify(window.smart_manager.getSelectedKeyIds())
					};

	window.smart_manager.send_request(params, function(response) {
		if ( 'failed' !== response ) {
			if( jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').hasClass('sm-ui-state-disabled') === false ) {
				jQuery('.sm_top_bar_action_btns #del_sm_editor_grid svg').addClass('sm-ui-state-disabled');
			}
			window.smart_manager.refresh();
			window.smart_manager.showNotification('Success', response);
		}
	});
}


Smart_Manager.prototype.updateLitePromoMessage = function( countRows ) {
	let count = parseInt( countRows );
	if( count >= 2 ) {
		jQuery('.sm_design_notice .sm_sub_headline.action').hide();
		jQuery('.sm_design_notice .sm_sub_headline.response').show();
	}
}

//Function to save inline edited data
Smart_Manager.prototype.saveData = function() {

	if( Object.getOwnPropertyNames(window.smart_manager.editedData).length <= 0 ) {
		return;
	}

	let params = {};
		params.data = {
						cmd: 'inline_update',
						active_module: window.smart_manager.dashboard_key,
						edited_data: JSON.stringify(window.smart_manager.editedData),
						security: window.smart_manager.sm_nonce,
						pro: ( ( typeof(window.smart_manager.sm_beta_pro) != 'undefined' ) ? window.smart_manager.sm_beta_pro : 0 ),
						table_model: (window.smart_manager.currentDashboardModel.hasOwnProperty('tables') ) ? window.smart_manager.currentDashboardModel.tables : ''
					};

	let hasInvalidClass = jQuery('.sm-grid-dirty-cell').hasClass('htInvalid');
	if ( hasInvalidClass == false ) {

		window.smart_manager.send_request(params, function(response) {

			if ( 'failed' !== response ) {

				if( window.smart_manager.isJSON( response ) && ( typeof(window.smart_manager.sm_beta_pro) == 'undefined' || ( typeof(window.smart_manager.sm_beta_pro) != 'undefined' && window.smart_manager.sm_beta_pro != 1 ) ) ) {
					response = JSON.parse( response );
					msg = response.msg;

					if( typeof( response.sm_inline_update_count ) != 'undefined' ) {
						if ( typeof (window.smart_manager.updateLitePromoMessage) !== "undefined" && typeof (window.smart_manager.updateLitePromoMessage) === "function" ) {
							window.smart_manager.updateLitePromoMessage( response.sm_inline_update_count );
						}
					}
				} else {
					msg = response;
				}

				if( window.smart_manager.editedCellIds.length > 0 ) {
					for( let i=0; i<window.smart_manager.editedCellIds.length; i++ ) {
						
						colProp = window.smart_manager.hot.getCellMeta(window.smart_manager.editedCellIds[i].row, window.smart_manager.editedCellIds[i].col);
						currentClassName = ( colProp.hasOwnProperty('className') ) ? colProp.className : '';

						if( currentClassName.indexOf('sm-grid-dirty-cell') != -1 ) {
							currentClassName = currentClassName.substr(0, currentClassName.indexOf('sm-grid-dirty-cell'));
						}

						window.smart_manager.hot.setCellMeta(window.smart_manager.editedCellIds[i].row, window.smart_manager.editedCellIds[i].col, 'className', currentClassName);
						jQuery('.smCheckboxColumnModel input[data-row='+window.smart_manager.editedCellIds[i].row+']').parents('tr').removeClass('sm_edited');
					}

					window.smart_manager.dirtyRowColIds = {};
					window.smart_manager.modifiedRows = new Array();
					window.smart_manager.refresh();
				}
				window.smart_manager.hot.render();
				window.smart_manager.showNotification( 'Success', msg );

			}

		});
		
	} else {
		window.smart_manager.showNotification( 'Error', 'You have entered incorrect data in the highlighted cells.' );
	}

}

Smart_Manager.prototype.hideNotification = function() {
	jQuery( "#sm_inline_dialog" ).dialog("close");
}

//Function to show notification messages
Smart_Manager.prototype.showNotification = function( title = '', content = '', dlgparams = {} ) {

	let dlg_title = ( title != '' ) ? title : 'Note',
		dlg_content = ( content != '' ) ? content : 'This feature is available only in the <a href="' + window.smart_manager.pricingPageURL + '" target="_blank">Pro</a> version.';

	let params = {
					title: dlg_title,
					content: '<p style="font-size:1.2em;margin:1em;">'+dlg_content+'</p>',
					modal: true,
					dlg_height: ( dlgparams.hasOwnProperty('height') ) ? dlgparams.height : 130,
					dlg_width: ( dlgparams.hasOwnProperty('width') ) ? dlgparams.width : 400,
					position_my: 'center center',
					position_at: 'center center',
					target: window,
					titleIsHtml: true,
					display_buttons: false
				};

	let autoHide = ( dlgparams.hasOwnProperty('autoHide') ) ? dlgparams.autoHide : true;

	window.smart_manager.inline_edit_dlg(params);  

	if( content != '' && autoHide === true ) {
		setTimeout(function(){
			window.smart_manager.hideNotification();
		},2000);  	
	}
	
}

//Function to show progress dialog
Smart_Manager.prototype.showProgressDialog = function( title = '' ) {

	let dlg_title = ( title != '' ) ? title : 'Please Wait';
		content = '<div class="sm_beta_background_update_progressbar"> <span class="sm_beta_background_update_progressbar_text" style="" >Initializing...</span></div><div class="sm_beta_batch_update_background_link" >Continue in background</div>'

	let params = {
					title: dlg_title,
					content: content,
					modal: true,
					dlg_height: 175,
					dlg_width: 400,
					position_my: 'center center',
					position_at: 'center center',
					target: window,
					display_buttons: false,
					show_close_icon: false
				};

	window.smart_manager.inline_edit_dlg(params);
}

//Function to show confirm dialog
Smart_Manager.prototype.showConfirmDialog = function( dlgparams ) {

	let dlg_title = ( dlgparams.hasOwnProperty('title') !== false && dlgparams.title != '' ) ? dlgparams.title : 'Warning',
		dlg_content = ( dlgparams.hasOwnProperty('content') !== false && dlgparams.content != '' ) ? dlgparams.content : 'Are you sure?',
		hideDialogOnYesClick = (dlgparams.btnParams.hasOwnProperty('hideOnYes')) ? dlgparams.btnParams.hideOnYes : true;


	if( dlgparams.hasOwnProperty('btnParams') === false ) {
		dlgparams.btnParams = {};
	}

	let params = {
					title: dlg_title,
					content: dlg_content,
					modal: true,
					dlg_height: ( dlgparams.hasOwnProperty('height') !== false && dlgparams.height != '' ) ? dlgparams.height : 150,
					dlg_width: ( dlgparams.hasOwnProperty('width') !== false && dlgparams.width != '' ) ? dlgparams.width : 400,
					position_my: 'center center',
					position_at: 'center center',
					target: window,
					display_buttons: true,
					titleIsHtml: ( dlgparams.hasOwnProperty('titleIsHtml') !== false ) ? dlgparams.titleIsHtml : false,
					buttons_model: [{
										text: ( (dlgparams.btnParams.hasOwnProperty('yesText')) ? dlgparams.btnParams.yesText : 'Yes' ),
										class: 'sm-dlg-btn-yes',
										click: function() {
											if( dlgparams.btnParams.hasOwnProperty('yesCallback') && typeof dlgparams.btnParams.yesCallback === "function" ) {
												
												if( dlgparams.btnParams.hasOwnProperty('yesCallbackParams') ) {
													dlgparams.btnParams.yesCallback( dlgparams.btnParams.yesCallbackParams );
												} else {
													dlgparams.btnParams.yesCallback();
												}
											}
											if(hideDialogOnYesClick){
												jQuery( this ).dialog( "close" );
											}
										}
									},
									{
										text: ( (dlgparams.btnParams.hasOwnProperty('noText')) ? dlgparams.btnParams.noText : 'No' ),
										class: 'sm-dlg-btn-no',
										click: function() {
											if( dlgparams.btnParams.hasOwnProperty('noCallback') && typeof dlgparams.btnParams.noCallback === "function" ) {
												dlgparams.btnParams.noCallback();
											}
											jQuery( this ).dialog( "close" );
										}
									}
							],
				};

	window.smart_manager.inline_edit_dlg(params);  
}

Smart_Manager.prototype.getCurrentDashboardState = function() {
	let tempDashModel = JSON.parse(JSON.stringify(window.smart_manager.currentDashboardModel));
	let tempColModel = JSON.parse(JSON.stringify(window.smart_manager.currentColModel));
	
	if(!Array.isArray(tempColModel)) {
		tempColModel = []
	}

	tempDashModel.columns = new Array();
	tempColModel.forEach(function(colObj) {
		if( typeof(colObj.hidden) != 'undefined' && colObj.hidden === false ) {
			tempDashModel.columns.push(colObj);
		}
	});

	return JSON.stringify({'columns': tempDashModel.columns, 'sort_params': tempDashModel.sort_params});
}

Smart_Manager.prototype.refreshDashboardStates = function() {
	window.smart_manager.dashboardStates[window.smart_manager.dashboard_key] = window.smart_manager.getCurrentDashboardState();
}

//Function to handle the state apply at regular intervals
Smart_Manager.prototype.updateState = function(refreshParams) {

	let viewSlug = window.smart_manager.getViewSlug(window.smart_manager.dashboardName);

	// do not refresh the states if view
	if ( typeof (window.smart_manager.refreshDashboardStates) !== "undefined" && typeof (window.smart_manager.refreshDashboardStates) === "function" && (!viewSlug) ) {
		window.smart_manager.refreshDashboardStates(); //refreshing the dashboard states
	}

	if( Object.getOwnPropertyNames(window.smart_manager.dashboardStates).length <= 0 ) {
		return;
	}

	//Ajax request to update the dashboard states
	let params = {};
		params.data_type = 'json';
		params.data = {
						cmd: 'save_state',
						security: window.smart_manager.sm_nonce,
						active_module: window.smart_manager.dashboard_key,
						dashboard_states: window.smart_manager.dashboardStates
					};
		
		// Code for passing extra param for view handling
		if( window.smart_manager.sm_beta_pro == 1 ) {
			params.data['is_view'] = 0;

			if(viewSlug){
				defaultParams.data['is_view'] = 1;
				defaultParams.data['active_module'] = viewSlug
			}
		}
	
		params.showLoader = false;

		if( refreshParams ) {
			if( typeof refreshParams.async != 'undefined' ) {
				params.async = refreshParams.async;
			}
		}

	window.smart_manager.send_request(params, function(refreshParams, response) {
			window.smart_manager.dashboardStates = {};
			if( refreshParams ) {
				if( typeof refreshParams.refreshDataModel != 'undefined' ) {
					window.smart_manager.refresh();
				}
			}
	}, refreshParams);
}

if(typeof window.smart_manager === 'undefined'){
	window.smart_manager = new Smart_Manager();
}

//Events to be handled on document ready
jQuery(document).ready(function() {
		window.smart_manager.init();
});

jQuery.widget('ui.dialog', jQuery.extend({}, jQuery.ui.dialog.prototype, { 
        _title: function(title) { 
            let $title = this.options.title || '&nbsp;' 
            if( ('titleIsHtml' in this.options) && this.options.titleIsHtml == true ) 
                title.html($title); 
            else title.text($title); 
        } 
}));

//Code for custom rendrers and extending Handsontable
(function(Handsontable){
	  let defaultTextEditor = Handsontable.editors.TextEditor.prototype.extend();

	//Function to override the SelectEditor function to handle color codes
    Handsontable.editors.SelectEditor.prototype.prepare = function () {
      	
      	// Call the original prepare method
      	Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

      	let _this2 = this,
      		selectOptions = this.cellProperties.selectOptions,
      		colorCodes = ( typeof(this.cellProperties.colorCodes) != 'undefined' ) ? this.cellProperties.colorCodes : '',
      		options = '';
		
			if (typeof selectOptions === 'function') {
				options = this.prepareOptions(selectOptions(this.row, this.col, this.prop));
			} else {
		    	options = this.prepareOptions(selectOptions);
		  	}

	      	this.select.innerHTML = '';

	      	Object.entries(options).forEach(([key, value]) => {
				let optionElement = document.createElement('OPTION');
					optionElement.value = key;

				if( colorCodes != ''  ) {
					for( let color in colorCodes ) {
						if( colorCodes[color].indexOf(key) != -1 ) {
							optionElement.className = 'sm_beta_select_'+color;
							break;		
						}
					}
				}

				optionElement.innerHTML = value;
				_this2.select.appendChild(optionElement);	
			});
	};

	Smart_Manager.prototype.dateEditor = function( currObj, arguments, format = 'Y-m-d H:i:s' ) {
      // Call the original createElements method
      Handsontable.editors.TextEditor.prototype.createElements.apply(currObj, arguments);

      // Create datepicker input and update relevant properties
      currObj.TEXTAREA = document.createElement('input');
      currObj.TEXTAREA.setAttribute('type', 'text');
      currObj.TEXTAREA.className = 'htDateTimeEditor';
      currObj.textareaStyle = currObj.TEXTAREA.style;
      currObj.textareaStyle.width = 0;
      currObj.textareaStyle.height = 0;

      // Replace textarea with datepicker
      Handsontable.dom.empty(currObj.TEXTAREA_PARENT);
      currObj.TEXTAREA_PARENT.appendChild(currObj.TEXTAREA);

        jQuery('.htDateTimeEditor').Zebra_DatePicker({ format: format,
                                    show_icon: false,
                                    show_select_today: false,
                                    default_position: 'below',
                                });
    };

	function customNumericTextEditor(query, callback) {
	    // ...your custom logic of the validator

	    RegExp.escape= function(s) {
		    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}; 

	    let regx = new RegExp("^[0-9]*"+ RegExp.escape(window.smart_manager.wooPriceDecimalSeparator) +"?[0-9]*$");
	    
	    if (regx.test(query)) {
	      callback(true);
	    } else {
	      callback(false);
	    }
	  }

	  function customPhoneTextEditor(value, callback) {
	    // ...your custom logic of the validator
	   	if (/^(\d|\-|\+|\.|\(|\)|\ )*$/.test(value)) { 
        	callback(true);
      	} else {
        	callback(false);
      	}
	  }

	  // Register an alias
	  Handsontable.validators.registerValidator('customNumericTextEditor', customNumericTextEditor);
	  Handsontable.validators.registerValidator('customPhoneTextEditor', customPhoneTextEditor);


	  let dateTimeEditor = Handsontable.editors.TextEditor.prototype.extend(),
	  		dateEditor = Handsontable.editors.TextEditor.prototype.extend(),
	  		timeEditor = Handsontable.editors.TextEditor.prototype.extend();



        dateTimeEditor.prototype.createElements = function() { window.smart_manager.dateEditor( this, arguments ) };
        dateEditor.prototype.createElements = function() { window.smart_manager.dateEditor( this, arguments, 'Y-m-d' ) };
        timeEditor.prototype.createElements = function() { window.smart_manager.dateEditor( this, arguments, 'H:i' ) };

        function numericRenderer(hotInstance, td, row, col, prop, value, cellProperties) {
		    Handsontable.renderers.NumericRenderer.apply(this, arguments);

		    let colObj = ( window.smart_manager.currentVisibleColumns.indexOf(col) != -1 ) ? window.smart_manager.currentVisibleColumns[col] : {};

		    if( !value && '' === value && null === value ) {
		    	value = parseFloat(value);
		    	value = ( colObj.hasOwnProperty('decimalPlaces') ) ? value.toFixed( parseInt( colObj.decimalPlaces ) ) : value;
		    }

		    if(!value || value === '' || value == null || value === 0 || value === 0.00 || value === '0' || value === '0.00' ) {
		        td.innerHTML = '<div class="wrapper htRight htNumeric htNoWrap">' + value + '</div>';
		    } else {
		    	td.innerHTML = '<div title="'+ td.innerHTML +'" class="wrapper">' + td.innerHTML + '</div>';
		    }

		    return td;
		}
	  	Handsontable.renderers.registerRenderer('numericRenderer', numericRenderer);

	  	function customTextRenderer(hotInstance, td, row, col, prop, value, cellProperties) {
		    Handsontable.renderers.TextRenderer.apply(this, arguments);
		    td.innerHTML = '<div title="'+ td.innerHTML +'" class="wrapper">' + td.innerHTML + '</div>';

		    return td;
		}
	  	Handsontable.renderers.registerRenderer('customTextRenderer', customTextRenderer);

	  	function customHtmlRenderer(hotInstance, td, row, col, prop, value, cellProperties) {
			Handsontable.renderers.HtmlRenderer.apply(this, arguments);
			td.innerHTML = '<div title="'+ td.innerText +'" class="wrapper">' + td.innerHTML + '</div>';
		    
		    return td;
		}
	  	Handsontable.renderers.registerRenderer('customHtmlRenderer', customHtmlRenderer);

	  	function customCheckboxRenderer(hotInstance, td, row, col, prop, value, cellProperties) {

		    Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
		    td.innerHTML = '<div class="wrapper">' + td.innerHTML + '</div>';
		    
		    return td;
		}
	  	Handsontable.renderers.registerRenderer('customCheckboxRenderer', customCheckboxRenderer);

	  	function customPasswordRenderer(hotInstance, td, row, col, prop, value, cellProperties) {

		    Handsontable.renderers.PasswordRenderer.apply(this, arguments);
		    td.innerHTML = '<div class="wrapper">' + td.innerHTML + '</div>';
		    
		    return td;
		}
	  	Handsontable.renderers.registerRenderer('customPasswordRenderer', customPasswordRenderer);

      function datetimeRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
        if( typeof(cellProperties.className) != 'undefined' ) { //code to higlight the cell on selection
            td.setAttribute('class',cellProperties.className);
        }

        td.innerHTML = value;

        td.innerHTML = '<div class="wrapper">' + td.innerHTML + '</div>';

        return td;
      }

		function longstringRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
			Handsontable.renderers.HtmlRenderer.apply(this, arguments);
			if( typeof(cellProperties.className) != 'undefined' ) { //code to higlight the cell on selection
				td.setAttribute('class',cellProperties.className);
			}

			td.innerHTML = '<div title="'+ td.innerText +'" class="wrapper">' + td.innerHTML + '</div>';

			return td;
		}

		function selectValueRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
			let source = cellProperties.selectOptions,
				className = ( typeof(cellProperties.className) != 'undefined' ) ? cellProperties.className : '',
				colorCodes = ( typeof(cellProperties.colorCodes) != 'undefined' ) ? cellProperties.colorCodes : '';

			// if( className != '' ) { //code to higlight the cell on selection
			// 	td.setAttribute('class',className);
			// }

			if( typeof source != 'undefined' && typeof value != 'undefined' && source.hasOwnProperty(value) ) {
				td.setAttribute('data-value',value);

				if( colorCodes != '' ) {					
					for( let color in colorCodes ) {
						if( colorCodes[color].indexOf(value) != -1 ) {
							// className = (( className != '' ) ? className + ' ' : '') + 'sm_beta_select_'+color;
							// td.setAttribute('class',className);
							td.classList.add('sm_beta_select_'+color)
							break;		
						}
					}
				}
				td.innerHTML = source[value];
			}

			td.innerHTML = '<div title="'+ td.innerText +'" class="wrapper">' + td.innerHTML + '</div>';

			return td;
		}

		function multilistRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
		// ...renderer logic
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			if( typeof(cellProperties.className) != 'undefined' ) { //code to higlight the cell on selection
				td.setAttribute('class',cellProperties.className);
			}
			
			td.innerHTML = '<div class="wrapper" style="line-height:30px;">' + td.innerHTML + '</div>';

			return td;
		}
		
	  Handsontable.renderers.registerRenderer('selectValueRenderer', selectValueRenderer);

	  	function select2Renderer(instance, td, row, col, prop, value, cellProperties) {

		    let selectedId;
		    let optionsList = (cellProperties.select2Options.data) ? cellProperties.select2Options.data : [];
		    let dynamicSelect2 = ( cellProperties.select2Options.hasOwnProperty('loadDataDynamically') ) ? true : false;
	  		
		    if( (typeof optionsList === "undefined" || typeof optionsList.length === "undefined" || !optionsList.length) && !dynamicSelect2 ) {
		        Handsontable.cellTypes.text.renderer(instance, td, row, col, prop, value, cellProperties);
		        return td;
		    }

		    if( dynamicSelect2 && typeof(value) == 'object' ) {
				jQuery(td).attr('data-value', JSON.stringify(value));

		    	let values = ( value ) ? value : [];

		    	value = [];
		    	var text = '';
		    	values.forEach(function(obj) {
		    		if( obj.text ) {
						value.push(obj.text.trim());
		    		}
				});

		    } else {
		    	let values = (value + "").split(",");

			    value = [];
			    for (let index = 0; index < optionsList.length; index++) {

			        if (values.indexOf(optionsList[index].id + "") > -1) {
			            selectedId = optionsList[index].id;
			            value.push(optionsList[index].text);
			        }
			    }	
		    }
		    
		    value = value.join(", ");

		    Handsontable.cellTypes.text.renderer(instance, td, row, col, prop, value, cellProperties);

			td.innerHTML = '<div class="wrapper">' + td.innerHTML + '</div>';
		    return td;
		}
	  	Handsontable.renderers.registerRenderer('select2Renderer', select2Renderer);

	  function imageRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
			let escaped = Handsontable.helper.stringify(value),
				img,
				className = 'sm_image_thumbnail';

		  if (escaped.indexOf('http') === 0) {
			img = document.createElement('IMG');
			img.src = value;
			img.width = 30;
			img.height = 30;

			img.setAttribute('class',className);

			Handsontable.dom.addEvent(img, 'mousedown', function (e){
			  e.preventDefault(); // prevent selection quirk
			});

			Handsontable.dom.empty(td);
			td.appendChild(img);
		  }
		  else {
			// render as text
			Handsontable.renderers.TextRenderer.apply(this, arguments);
		  }

		  if( typeof(cellProperties.className) != 'undefined' ) {
				className += ' '+ cellProperties.className;
				td.setAttribute('class',cellProperties.className);
		  }

		  td.innerHTML = '<div class="wrapper">' + td.innerHTML + '</div>';

		  return td;
	  }

	  // Register an alias for datetime
	  Handsontable.cellTypes.registerCellType('sm.datetime', {
        editor: dateTimeEditor,
        renderer: datetimeRenderer,
        allowInvalid: true,
      });

	  // Register an alias for date
      Handsontable.cellTypes.registerCellType('sm.date', {
        editor: dateEditor,
        renderer: datetimeRenderer,
        allowInvalid: true,
      });

      // Register an alias for time
      Handsontable.cellTypes.registerCellType('sm.time', {
        editor: timeEditor,
        renderer: datetimeRenderer,
        allowInvalid: true,
      });

	  // Register an alias for image
	  Handsontable.cellTypes.registerCellType('sm.image', {
		renderer: imageRenderer,
		allowInvalid: true,
	  });

	  // Register an alias for image
	  Handsontable.cellTypes.registerCellType('sm.multipleImage', {
		renderer: Handsontable.renderers.HtmlRenderer,
		allowInvalid: true,
	  });

	  // Register an alias for longstrings
	  Handsontable.cellTypes.registerCellType('sm.longstring', {
		editor: defaultTextEditor,
		renderer: multilistRenderer,
		allowInvalid: true,
	  });

	  // Register an alias for serialized
	  Handsontable.cellTypes.registerCellType('sm.serialized', {
		editor: defaultTextEditor,
		renderer: multilistRenderer,
		allowInvalid: true,
	  });

	// Register an alias for multilist
	  Handsontable.cellTypes.registerCellType('sm.multilist', {
		editor: defaultTextEditor,
		renderer: multilistRenderer,
		allowInvalid: true,
	  });

})(Handsontable);
