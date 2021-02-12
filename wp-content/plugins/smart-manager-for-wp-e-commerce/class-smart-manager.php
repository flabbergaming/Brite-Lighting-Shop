<?php

defined( 'ABSPATH' ) || exit;

class Smart_Manager {

	static $text_domain, $prefix, $sku, $plugin_file, $sm_is_woo40, $sm_is_woo39, $sm_is_woo36, $sm_is_woo30, $sm_is_woo22, $sm_is_woo21;

	public  $plugin_path 	= '',
			$plugin_url 	= '',
			$plugin_info 	= '',
			$version 		= '',
			$updater 		= '',
			$error_message 	= '',
			$upgrade 		= '',
			$update_msg 	= '',
			$success_msg 	= '',
			$sm_dashboards_final = '',
			$sm_accessible_views = '',
			$sm_owned_views = '',
			$sm_public_views = '',
			$sm_view_post_types = '';

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		$this->define_constants(); // for defining constants
		$this->includes(); // for including necessary files
		$this->init_hooks(); // for defining all actions & filters
	}

	//Function for defining WooCommerce related constants for SM
	public function define_woo_constants() {
		if( defined('WOOCOMMERCE_VERSION') ) {
			// checking the version for WooCommerce plugin
			define ( 'IS_WOO13', version_compare ( WOOCOMMERCE_VERSION, '1.4', '<' ) );

			if ( version_compare( WOOCOMMERCE_VERSION , '4.0.0', '<' ) ) {

				if ( version_compare( WOOCOMMERCE_VERSION , '3.9.0', '<' ) ) {

					if ( version_compare( WOOCOMMERCE_VERSION , '3.6.0', '<' ) ) {

						if (version_compare ( WOOCOMMERCE_VERSION, '3.0.0', '<' )) {
								
							if (version_compare ( WOOCOMMERCE_VERSION, '2.2.0', '<' )) {

								if (version_compare ( WOOCOMMERCE_VERSION, '2.1.0', '<' )) {

									if (version_compare ( WOOCOMMERCE_VERSION, '2.0', '<' )) {
										define ( 'SM_IS_WOO16', "true" );
									} else {
										define ( 'SM_IS_WOO16', "false" );	
									}
									define ( 'SM_IS_WOO21', "false" );
								} else {
									define ( 'SM_IS_WOO16', "true" );
									define ( 'SM_IS_WOO21', "true" );
								}
								define ( 'SM_IS_WOO22', "false" );
							} else {
								define ( 'SM_IS_WOO16', "true" );
								define ( 'SM_IS_WOO21', "true" );
								define ( 'SM_IS_WOO22', "true" );
							}
							define ( 'SM_IS_WOO30', "false" );
						} else {
							define ( 'SM_IS_WOO16', "true" );
							define ( 'SM_IS_WOO21', "true" );
							define ( 'SM_IS_WOO22', "true" );
							define ( 'SM_IS_WOO30', "true" );
						}
						define ( 'SM_IS_WOO36', "false" );
					} else {
						define( 'SM_IS_WOO36', 'true' );
						define( 'SM_IS_WOO30', 'true' );
						define( 'SM_IS_WOO22', 'true' );
						define( 'SM_IS_WOO21', 'true' );
						define( 'SM_IS_WOO16', 'true' );
					}
					define( 'SM_IS_WOO39', 'false' );
				} else {
					define( 'SM_IS_WOO39', 'true' );
					define( 'SM_IS_WOO36', 'true' );
					define( 'SM_IS_WOO30', 'true' );
					define( 'SM_IS_WOO22', 'true' );
					define( 'SM_IS_WOO21', 'true' );
					define( 'SM_IS_WOO16', 'true' );
				}
				define( 'SM_IS_WOO40', 'false' );
			} else {
				define( 'SM_IS_WOO40', 'true' );
				define( 'SM_IS_WOO39', 'true' );
				define( 'SM_IS_WOO36', 'true' );
				define( 'SM_IS_WOO30', 'true' );
				define( 'SM_IS_WOO22', 'true' );
				define( 'SM_IS_WOO21', 'true' );
				define( 'SM_IS_WOO16', 'true' );
			}
		}
	}

	public function define_constants() {
		$plugin = plugin_basename( SM_PLUGIN_FILE );
		$msg = str_word_count("Upgrade In Progress");
		$upmsg = "Upgrade to";

		$this->plugin_path  = untrailingslashit( plugin_dir_path( SM_PLUGIN_FILE ) );
		$this->plugin_url   = untrailingslashit( plugins_url( '/', SM_PLUGIN_FILE ) );
		$this->update_msg   = 'editing';
		
		define( 'SM_PLUGIN_DIR', dirname( $plugin ) );
		define( 'SM_PLUGIN_BASE_NM', $plugin );
		define( 'SM_TEXT_DOMAIN', 'smart-manager-for-wp-e-commerce' );
		define( 'SM_PREFIX', 'sa_smart_manager' );
		define( 'SM_SKU', 'sm' );
		define( 'SM_PLUGIN_NAME', 'Smart Manager' );
		define( 'SM_UPGRADE', $msg );
		define( 'SM_DUPGRADE', ( ($msg*8)+1 ) );
		define( 'SM_UPDATE', $upmsg );
		define( 'SM_ADMIN_URL', get_admin_url() ); //defining the admin url

		define( 'SM_PLUGIN_DIR_PATH', dirname( SM_PLUGIN_FILE ) );
		define( 'SM_PLUGINS_FILE_PATH', dirname( dirname( SM_PLUGIN_FILE ) ) );
		define( 'SM_PLUGIN_DIRNAME', plugins_url( '', SM_PLUGIN_FILE ) );

		if ( ! defined( 'SM_IMG_URL' ) ) {
			define( 'SM_IMG_URL', SM_PLUGIN_DIRNAME . '/assets/images/' );
		}

		if (!defined('STORE_APPS_URL')) {
			define( 'STORE_APPS_URL', 'https://www.storeapps.org/' );
		}

		if ( ! defined( 'SMPRO' ) ) {
			if (file_exists ( (dirname ( SM_PLUGIN_FILE )) . '/pro/assets/js/smart-manager.js' )) { 
				define ( 'SMPRO', true );
			} else {
				define ( 'SMPRO', false );
			}
		}

		if ( ! defined( 'SM_PRO_URL' ) ) {
			define( 'SM_PRO_URL', (dirname ( SM_PLUGIN_FILE )) . '/pro/' );
		}

		// Static variables
		self::$text_domain = (defined('SM_TEXT_DOMAIN')) ? SM_TEXT_DOMAIN : 'smart-manager-for-wp-e-commerce';
		self::$prefix = (defined('SM_PREFIX')) ? SM_PREFIX : 'sa_smart_manager';
		self::$sku = (defined('SM_SKU')) ? SM_SKU : 'sm';
		self::$plugin_file = (defined('SM_PLUGIN_FILE')) ? SM_PLUGIN_FILE : '';
		
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$plugin_info = get_plugins();
		$this->plugin_info = $plugin_info [SM_PLUGIN_BASE_NM];
		
		if( is_callable( array( 'Smart_Manager', 'get_version' ) ) ) {
			self::get_version();
		}
		
		$this->updater = rand(3.0,3.9);
		$this->dupdater = rand(25.0,25.9);
		$this->upgrade = (defined('SM_UPGRADE')) ? SM_UPGRADE : 3;
		$this->dupgrade = (defined('SM_DUPGRADE')) ? SM_DUPGRADE : 25;
		$this->success_msg   = (defined('SM_UPDATE')) ? SM_UPDATE : '';
	}

	//Function for defining dashboards
	public function get_dashboards() {

		global $wp_version, $wpdb;

		$post_types = get_post_types( array(), 'objects' ); //Code to get all the custom post types as dashboards

		$ignored_post_types = array('revision', 'product_variation', 'shop_order_refund');

		$this->sm_dashboards_final = array();
		$this->sm_public_dashboards = array();

		if( !empty( $post_types ) ) {
			foreach( $post_types as $post_type => $obj  ) {

				if( in_array($post_type, $ignored_post_types) ) {
					continue;
				}

				$this->sm_dashboards_final[$post_type] = $obj->label;
				if( !empty( $obj->public ) && $obj->public == 1 ) {
					$this->sm_public_dashboards[] = $post_type;
				}
			}
		}
		$this->sm_dashboards_final ['user'] = __(ucwords('users'), 'smart-manager-for-wp-e-commerce');

		if ( ! defined( 'SM_BETA_ALL_DASHBOARDS' ) ) {
			define( 'SM_BETA_ALL_DASHBOARDS', json_encode( $this->sm_dashboards_final ) );
		}

		$this->sm_dashboards_final = apply_filters('sm_active_dashboards', $this->sm_dashboards_final);
	} 

	//Function for getting all eligible views
	public function get_views() {

		if( !( defined('SMPRO') && true === SMPRO ) ) {
			return;
		}

		if( class_exists( 'Smart_Manager_Pro_Views' ) ) {
			$view_obj = Smart_Manager_Pro_Views::get_instance();
			if( is_callable( array( $view_obj, 'get_all_accessible_views' ) ) ){
				$views = $view_obj->get_all_accessible_views($this->sm_dashboards_final);
				if( ! empty( $views ) ) {
					$this->sm_accessible_views = $views['accessible_views'];
					$this->sm_owned_views = $views['owned_views'];
					$this->sm_public_views = $views['public_views'];
					$this->sm_view_post_types = ( ! empty( $views['view_post_types'] ) ) ? $views['view_post_types'] : array();
				}
			}
		}

		$this->sm_accessible_views = apply_filters('sm_accessible_views', $this->sm_accessible_views);
	} 



	// Function to include necessary files for SM
	public function includes() {

		global $current_user;

		if( file_exists( $this->plugin_path . '/classes/class-smart-manager-install.php' ) ) { 
			include_once $this->plugin_path . '/classes/class-smart-manager-install.php';
		}

		if( file_exists( $this->plugin_path . '/classes/class-smart-manager-controller.php' ) ) { 
			include_once $this->plugin_path . '/classes/class-smart-manager-controller.php';
			new Smart_Manager_Controller();
		}

		if( file_exists( $this->plugin_path . '/classes/class-smart-manager-utils.php' ) ) { 
			include_once $this->plugin_path . '/classes/class-smart-manager-utils.php';
		}

		//for including background updater & other libraries
		if ( defined('SMPRO') && SMPRO === true ) {

			if ( ! class_exists( 'ActionScheduler' ) && file_exists( dirname( SM_PLUGIN_FILE ). '/pro/libraries/action-scheduler/action-scheduler.php' ) ) {
				include_once 'pro/libraries/action-scheduler/action-scheduler.php';
			}

			if( file_exists( (dirname( SM_PLUGIN_FILE )) . '/pro/classes/class-smart-manager-pro-background-updater.php') ) {
				include_once 'pro/classes/class-smart-manager-pro-background-updater.php';
			}

			if( !class_exists( 'Smart_Manager_Pro_Access_Privilege' ) && file_exists( (dirname( SM_PLUGIN_FILE )) . '/pro/classes/class-smart-manager-pro-access-privilege.php' ) ) {
				include_once 'pro/classes/class-smart-manager-pro-access-privilege.php';
			}
	
			if ( !class_exists( 'StoreApps_Upgrade_3_7' ) ) {
				require_once 'pro/sa-includes/class-storeapps-upgrade-3-7.php';
			}

			if ( !class_exists( 'Smart_Manager_Pro_Views' ) && file_exists( (dirname( SM_PLUGIN_FILE )) . '/pro/classes/class-smart-manager-pro-views.php' ) ) {
				require_once 'pro/classes/class-smart-manager-pro-views.php';
			}
		}

		if ( is_admin() ) {
			if( file_exists( $this->plugin_path . '/classes/class-smart-manager-admin-welcome.php' ) ) { 
				include_once $this->plugin_path . '/classes/class-smart-manager-admin-welcome.php';
			}

			if( file_exists( $this->plugin_path . '/classes/class-smart-manager-pricing.php' ) ) { 
				include_once $this->plugin_path . '/classes/class-smart-manager-pricing.php';
			}

			if( file_exists( $this->plugin_path . '/classes/class-storeapps-marketplace.php' ) ) { 
				include_once $this->plugin_path . '/classes/class-storeapps-marketplace.php';
			}

			if( file_exists( $this->plugin_path . '/classes/deactivation-survey/class-sa-smart-manager-deactivation.php' ) ) { 
				include_once $this->plugin_path . '/classes/deactivation-survey/class-sa-smart-manager-deactivation.php';		
			}

			if ( class_exists( 'SA_Smart_Manager_Deactivation' ) ) {
				if ( defined('SMPRO') && true === SMPRO ) {
					$sm_plugin_name = SM_PLUGIN_NAME . ' - Pro';
				} else {
					$sm_plugin_name = SM_PLUGIN_NAME . ' - Lite';
				}
				$sa_sm_deativate = new SA_Smart_Manager_Deactivation( SM_PLUGIN_BASE_NM, $sm_plugin_name );
			}

		}

	}

	public function init_hooks() {

		register_activation_hook( SM_PLUGIN_FILE, array( 'Smart_Manager_Install', 'install' ) );
		register_deactivation_hook( SM_PLUGIN_FILE, array( 'Smart_Manager_Install', 'deactivate' ) );
		add_action( 'plugins_loaded', array( &$this, 'on_plugins_loaded' ) );

		//filters for handling quick_help_widget
		add_filter( 'sa_active_plugins_for_quick_help', array( &$this, 'quick_help_widget' ), 10, 2 );
		add_filter( 'sa_is_page_for_notifications', array( &$this, 'is_page_for_notifications' ), 10, 2 );

		add_action ( 'admin_head', array(&$this,'remove_help_tab') ); // For removing the help tab
		
		add_filter( 'site_transient_update_plugins', array( &$this, 'overwrite_site_transient' ), 11, 1 );
		add_filter( 'pre_set_site_transient_update_plugins', array( &$this, 'overwrite_site_transient' ), 11, 1 );
		
		add_action( 'admin_enqueue_scripts', array( $this, 'sa_sm_dequeue_scripts' ), 998 );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ), 999 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		
		add_action( 'admin_init', array( $this, 'on_admin_init' ) );
		add_action( 'admin_init', array( $this, 'localize_smart_manager' ) ); //Language loader

		add_action( 'admin_notices', array( $this, 'add_admin_notices' ) );

		// Remove WP footer on SM pages
		add_filter( 'admin_footer_text', array( &$this, 'footer_text') );
		add_filter( 'update_footer', array( &$this, 'update_footer_text'), 99 );

		//For handling media links on plugins page
		add_action( 'admin_footer', array( &$this, 'add_plugin_social_links' ) );

		add_action( 'admin_footer', array( $this, 'smart_manager_support_ticket_content' ) );
		add_action( 'admin_footer', array( $this, 'manage_with_smart_manager' ) );

		add_action( 'admin_menu', array( $this, 'add_menu_access' ), 9 );

		if (is_admin() ) {
			add_action ( 'wp_ajax_sm_update_to_pro', array( $this, 'update_to_pro' ) );
		}

		if ( defined('SMPRO') && SMPRO === false ) {
			add_action( 'admin_init', array( $this, 'show_upgrade_to_pro' ) ); //for handling Pro to Lite
		} else if ( defined('SMPRO') && SMPRO === true ) {
			add_action( 'admin_init', array( $this, 'pro_activated' ) );
		}
	}

	// Find latest StoreApps Upgrade file
	public function get_latest_upgrade_class() {

		$available_classes = get_declared_classes();
		$available_upgrade_classes = array_filter( $available_classes, function ( $class_name ) {
																								return strpos( $class_name, 'StoreApps_Upgrade_' ) === 0;
																							} );
		$latest_class = 'StoreApps_Upgrade_3_7';
		$latest_version = 0;
		foreach ( $available_upgrade_classes as $class ) {
			$exploded = explode( '_', $class );
			$get_numbers = array_filter( $exploded, function ( $value ) {
														return is_numeric( $value );
													} );
			$version = implode( '.', $get_numbers );
			if ( version_compare( $version, $latest_version, '>' ) ) {
				$latest_version = $version;
				$latest_class = $class;
			}
		}

		return $latest_class;
	}

	//Function for actions to be done on 'plugins_loaded' event
	public function on_plugins_loaded() {
		global $current_user;

		//define woo constants
		$this->define_woo_constants();	
		self::$sm_is_woo40 = (defined('SM_IS_WOO40')) ? SM_IS_WOO40 : '';
		self::$sm_is_woo39 = (defined('SM_IS_WOO39')) ? SM_IS_WOO39 : '';
		self::$sm_is_woo36 = (defined('SM_IS_WOO36')) ? SM_IS_WOO36 : '';
		self::$sm_is_woo30 = (defined('SM_IS_WOO30')) ? SM_IS_WOO30 : '';
		self::$sm_is_woo22 = (defined('SM_IS_WOO22')) ? SM_IS_WOO22 : '';
		self::$sm_is_woo21 = (defined('SM_IS_WOO21')) ? SM_IS_WOO21 : '';

		//Code for handling the in app offer
		if ( ! class_exists( 'SA_In_App_Offer' ) && file_exists( (dirname( SM_PLUGIN_FILE )) . '/classes/sa-includes/class-sa-in-app-offer.php' ) ) {
			include_once 'classes/sa-includes/class-sa-in-app-offer.php';
			$args = array(
				'file'           => (dirname( SM_PLUGIN_FILE )) . '/classes/sa-includes/',
				'prefix'         => 'sm',				// prefix/slug of your plugin
				'option_name'    => 'sa_offer_bfcm_2020',
				'campaign'       => 'sa_bfcm_2020',
				'start'          => '2020-11-24 06:00:00',
				'end'            => '2020-12-03 06:00:00',
				'is_plugin_page' => ( !empty($_GET['page']) && ( 'smart-manager' === $_GET['page'] || 'sm-storeapps-plugins' === $_GET['page'] ) ) ? true : false,	// page where you want to show offer, do not send this if no plugin page is there and want to show offer on Products page
			);
			$sa_offer = SA_In_App_Offer::get_instance( $args );
			if ( ! defined( 'SA_OFFER_VISIBLE' ) ) {

				$show = false;

				$timezone_format = _x( 'Y-m-d', 'timezone date format' );
				$current_date    = strtotime( date_i18n( $timezone_format ) );
				$start           = strtotime( $args['start'] );
				$end             = strtotime( $args['end'] );
				if ( ( $current_date >= $start ) && ( $current_date <= $end ) ) {
					$show = true;
				}

				define( 'SA_OFFER_VISIBLE', $show );
			}
		}

		if ( ! empty($_GET['page']) && $_GET['page'] == "smart-manager" && ! empty( $_GET['dashboard'] ) ) {
			if( ! empty( $_GET['is_view'] ) ) {
				update_option('sm_wp_dashboard_view_'.get_current_user_id(), $_GET['dashboard'] );
				wp_safe_redirect( remove_query_arg(array( 'dashboard', 'is_view' ), wp_unslash( $_SERVER['REQUEST_URI'] ) ) );
			} else {
				update_option('sm_wp_dashboard_post_type_'.get_current_user_id(), $_GET['dashboard'] );
				wp_safe_redirect( remove_query_arg('dashboard', wp_unslash( $_SERVER['REQUEST_URI'] ) ) );
			}
			
			exit;
		}

		if ( defined('SMPRO') && SMPRO === true ) {
			$latest_upgrade_class = $this->get_latest_upgrade_class();

			$sku = SM_SKU;
			$prefix = SM_PREFIX;
			$plugin_name = SM_PLUGIN_NAME;
			$documentation_link = 'https://www.storeapps.org/knowledgebase_category/smart-manager/';
			$GLOBALS['smart_manager_upgrade'] = new $latest_upgrade_class( SM_PLUGIN_FILE, $sku, $prefix, $plugin_name, SM_TEXT_DOMAIN, $documentation_link );
		}
	}

	// function to handle the display of quick help widget
	public function quick_help_widget( $active_plugins, $upgrader ) {
		
		if ( is_admin() && !empty( $_GET['page'] ) && ( 'smart-manager-settings' === $_GET['page'] ) ) {
			$active_plugins[SM_SKU] = 'smart-manager';
		} elseif ( array_key_exists( SM_SKU, $active_plugins ) ) {
			unset( $active_plugins[SM_SKU] );
		}
			
		return $active_plugins;
	}

	public function is_page_for_notifications( $is_page, $upgrader ) {
		
		$landing_page = ( !empty( $_GET['landing-page'] ) ) ? $_GET['landing-page'] : '';

		if ( is_admin() && ! empty( $_GET['page'] ) && ( ( 'smart-manager' === $_GET['page'] && 'sm-about' !== $landing_page ) || 'smart-manager-settings' === $_GET['page'] ) ) {
			return true;
		}
			
		return $is_page;
	}

	// Function to override the site transient
	public function overwrite_site_transient( $plugin_info ) {

		if ( ! defined('SM_SKU') ) {
			return $plugin_info;
		}
	
		$data = get_option( '_storeapps_connector_data', array() );
		$sm_license_key = !empty($data[SM_SKU]) ? $data[SM_SKU]['license_key'] : '';
	
		$sm_download_url = $this->get_pro_download_url();
	
		if ( file_exists((dirname( SM_PLUGIN_FILE )) . '/pro/sm.js') && (empty($sm_license_key) || empty($sm_download_url)) ) {
			$plugin_base_file = plugin_basename( SM_PLUGIN_FILE );
	
			$live_version = !empty($data[SM_SKU]['live_version']) ? $data[SM_SKU]['live_version'] : '';
			$installed_version = !empty($data[SM_SKU]['installed_version']) ? $data[SM_SKU]['installed_version'] : '';
	
			if ( version_compare( $live_version, $installed_version, '>' ) ) {
				$plugin_info->response[$plugin_base_file]->package = '';
			}		
		}
	
		return $plugin_info;
	}

	public function get_pro_download_url() {
		$sm_old_download_url = '';
		$sm_new_download_url = '';
		if ( defined('SM_PREFIX') ) {
			$sm_old_download_url = get_site_option( SM_PREFIX.'_download_url' );
		}
		$data = get_option( '_storeapps_connector_data', array() );
		if ( defined('SM_SKU') && ! empty( $data[SM_SKU] ) ) {
			$sm_new_download_url = ( !empty( $data[SM_SKU]['download_url'] ) ) ? $data[SM_SKU]['download_url'] : '';
		}
		$sm_download_url = ( ! empty( $sm_new_download_url ) ) ? $sm_new_download_url : $sm_old_download_url;
		return $sm_download_url;
	}
	
	public function is_pro_available() {
		$sm_download_url = $this->get_pro_download_url();
		if ( ! file_exists( ( dirname( SM_PLUGIN_FILE ) ) . '/pro/assets/js/smart-manager.js' ) && ! empty( $sm_download_url ) ) {
			return true;
		}
		return false;
	}

	/*
	* Function to to handle media links on plugin page
	*/ 
	public function add_plugin_social_links() {

		$is_pro_available = $this->is_pro_available();
		if( $is_pro_available === true ) { //request ftp credentials form
			wp_print_request_filesystem_credentials_modal();
		}

		?>
		<script type="text/javascript">
			jQuery(function() {
				jQuery(document).ready(function() {
					jQuery('tr[id="smart-manager"]').find( 'div.plugin-version-author-uri' ).addClass( 'sa_smart_manager_social_links' );
				});
			});
		</script>
		<style type="text/css">
			@keyframes beat {
				to { transform: scale(1.1); }
			}
			.sm_pricing_icon {
				animation: beat .25s infinite alternate;
				transform-origin: center;
				color: #ea7b00;
				display: inline-block;
				font-size: 1.5em;
			}
		</style>

		<?php
	}

	public function localize_smart_manager() {
		$text_domain = SM_TEXT_DOMAIN;
	
		$plugin_dirname = dirname( plugin_basename(SM_PLUGIN_FILE) );
	
		$locale = apply_filters( 'plugin_locale', get_locale(), $text_domain );
	
		$loaded = load_textdomain( $text_domain, WP_LANG_DIR . '/plugins/' . $text_domain . '-' . $locale . '.mo' );    
	
		if ( ! $loaded ) {
			$loaded = load_plugin_textdomain( $text_domain, false, $plugin_dirname . '/languages/' );
		}
	}

	//function to show the upgrade to Pro link only for Pro to Lite
	public function show_upgrade_to_pro() {

		if( !( !empty( $_GET['page'] ) && ( 'smart-manager' === $_GET['page'] || 'smart-manager-woo' === $_GET['page'] || 'smart-manager-wpsc' === $_GET['page'] ) ) ) {
			return;
		}

		$sm_license_key = get_site_option( SM_PREFIX.'_license_key' );

		if ( !empty($sm_license_key) ) {
			$storeapps_validation_url = 'https://www.storeapps.org/?wc-api=validate_serial_key&serial=' . urlencode( $sm_license_key ) . '&is_download=true&sku=' . SM_SKU . '&uuid=' . admin_url();
			$resp_type = array ('headers' => array ('content-type' => 'application/text' ) );
			$response_info = wp_remote_post( $storeapps_validation_url, $resp_type ); //return WP_Error on response failure

			if (is_array( $response_info )) {
				$response_code = wp_remote_retrieve_response_code( $response_info );
				$response_msg = wp_remote_retrieve_response_message( $response_info );

				if ($response_code == 200) {
					$storeapps_response = wp_remote_retrieve_body( $response_info );
					$decoded_response = json_decode( $storeapps_response );
					if ($decoded_response->is_valid == 1) {               
						update_site_option( SM_PREFIX.'_download_url', $decoded_response->download_url );
						define('SMPROTOLITE', true);
					} else {
						define('SMPROTOLITE', false);
					}
				} else {
					define('SMPROTOLITE', false);
				}
			}
		}
	}

	public function pro_activated() {
		$is_check = get_option( SM_PREFIX . '_check_update', 'no' );
		if ( $is_check === 'no' ) {
		  $response = wp_remote_get( 'https://www.storeapps.org/wp-admin/admin-ajax.php?action=check_update&plugin='.SM_SKU );
		  update_option( SM_PREFIX . '_check_update', 'yes' );
		}
	}

	function get_free_menu_position($start, $increment = 0.0001) {
		foreach ($GLOBALS['menu'] as $key => $menu) {
			$menus_positions[] = $key;
		}
	
		if (!in_array($start, $menus_positions)) return $start;
	
		/* the position is already reserved find the closet one */
		while (in_array($start, $menus_positions)) {
			$start += $increment;
		}
		return $start;
	}

	// Function to draw the relevant page
	function add_admin_page() {

		if( !empty($_GET['landing-page']) ) {
			$GLOBALS['smart_manager_admin_welcome']->show_welcome_page();
		} else if( isset( $_GET['sm-settings'] ) && ( class_exists( 'Smart_Manager_Pro_Access_Privilege' ) && is_callable( array('Smart_Manager_Pro_Access_Privilege', 'render_access_privilege_settings') ) ) ) {
			Smart_Manager_Pro_Access_Privilege::render_access_privilege_settings();
		} else if( !empty( $_GET['page'] ) && 'smart-manager' === $_GET['page'] ) {
			$this->show_console_beta();
		} else if( ( !empty( $_GET['page'] ) && 'smart-manager-pricing' === $_GET['page'] ) && ( class_exists( 'Smart_Manager_Pricing' ) && is_callable( array('Smart_Manager_Pricing', 'sm_show_pricing') ) ) ) {
			Smart_Manager_Pricing::sm_show_pricing();
		} else if( ( !empty( $_GET['page'] ) && 'sm-storeapps-plugins' === $_GET['page'] ) && ( class_exists( 'StoreApps_Marketplace' ) && is_callable( array('StoreApps_Marketplace', 'init') ) ) ) {
			StoreApps_Marketplace::init();
		} else {
			wp_redirect( admin_url( 'admin.php?page=smart-manager' ) );
		}
	}

	// Function to add menu
	function add_menu() {
		global $wpdb, $current_user;
	
		if (!function_exists('wp_get_current_user')) {
			require_once (ABSPATH . 'wp-includes/pluggable.php'); // Sometimes conflict with SB-Welcome Email Editor
		}
	
		$current_user = wp_get_current_user(); // Sometimes conflict with SB-Welcome Email Editor
	
		if ( !isset( $current_user->roles[0] ) ) {
			$roles = array_values( $current_user->roles );
		} else {
			$roles = $current_user->roles;
		}
	
		//Fix for the client
		if ( !empty( $current_user->caps ) ) {
			$caps = array_keys($current_user->caps);
			$current_user_caps = $roles[0] = (!empty($caps)) ? $caps[0] : '';
		}
	
		$position = (string) $this->get_free_menu_position(56.00001);
	
		if( ( defined( 'SMPRO' ) && SMPRO === true ) || ( ( !empty( $current_user->roles[0] ) && $current_user->roles[0] == 'administrator' ) || ( !empty( $current_user_caps ) && $current_user_caps == 'administrator') ) ) {
			$page = add_menu_page( 'Smart Manager', 'Smart Manager','read', 'smart-manager', array( $this, 'add_admin_page' ), 'dashicons-performance', $position );
	
			if( defined( 'SMPRO' ) && SMPRO !== true && ( ! defined('SA_OFFER_VISIBLE') || ( defined('SA_OFFER_VISIBLE') && SA_OFFER_VISIBLE === false ) ) ) {
				add_submenu_page( 'smart-manager', __( '<span class="sm_pricing_icon"> 🔥 </span> Go Pro', 'smart-manager-for-wp-e-commerce' ), __( '<span class="sm_pricing_icon"> 🔥 </span> Go Pro', 'smart-manager-for-wp-e-commerce' ), 'manage_options', 'smart-manager-pricing', array( $this, 'add_admin_page' ) );
			}
	
			if( ( defined( 'SMPRO' ) && SMPRO === true ) && ( ( !empty( $current_user->roles[0] ) && $current_user->roles[0] == 'administrator' ) || ( !empty( $current_user_caps ) && $current_user_caps == 'administrator') ) ) {
				add_submenu_page( 'smart-manager', __( 'Settings', 'smart-manager-for-wp-e-commerce' ),  __( 'Settings', 'smart-manager-for-wp-e-commerce' ), 'manage_options', 'smart-manager&sm-settings', array( $this, 'add_admin_page' ) );
			}
	
			add_submenu_page( 'smart-manager', __( 'Docs & Support', 'smart-manager-for-wp-e-commerce' ),  __( 'Docs & Support', 'smart-manager-for-wp-e-commerce' ), 'manage_options', 'smart-manager&landing-page=sm-about', array( $this, 'add_admin_page' ) );
	
			$show_sa_plugins_page = true;
			$show_sa_plugins_page = apply_filters('sm_show_sa_plugins_page', $show_sa_plugins_page);
	
			if( !empty( $show_sa_plugins_page ) ) {
				add_submenu_page( 'smart-manager', __( 'StoreApps Plugins', 'smart-manager-for-wp-e-commerce' ),  __( 'StoreApps Plugins', 'smart-manager-for-wp-e-commerce' ), 'manage_options', 'sm-storeapps-plugins', array( $this, 'add_admin_page' ) );	
			}
		}	
	}

	function add_menu_access() {
		global $wpdb, $current_user;
	
		if (!function_exists('wp_get_current_user')) {
			require_once (ABSPATH . 'wp-includes/pluggable.php'); // Sometimes conflict with SB-Welcome Email Editor
		}
	
		$current_user = wp_get_current_user(); // Sometimes conflict with SB-Welcome Email Editor
			
			if ( !isset( $current_user->roles[0] ) ) {
				$roles = array_values( $current_user->roles );
			} else {
				$roles = $current_user->roles;
			}
	
			//Fix for the client
			if ( !empty( $current_user->caps ) ) {
				$caps = array_keys($current_user->caps);
				$current_user_caps = $roles[0] = (!empty($caps)) ? $caps[0] : '';
			}
	
		$query = "SELECT option_value FROM {$wpdb->prefix}options WHERE option_name = 'sm_" . $roles [0] . "_dashboard'";
		$result_old = $wpdb->get_results( $query );
	
		$beta_dashboard_privileges = array();
	
		if( class_exists('Smart_Manager_Pro_Access_Privilege') ) {
			$option_nm = Smart_Manager_Pro_Access_Privilege::$access_privilege_option_start."".$roles [0]."".Smart_Manager_Pro_Access_Privilege::$access_privilege_option_end;
			$beta_dashboard_privileges = $wpdb->get_results( $wpdb->prepare( "SELECT option_name, option_value FROM {$wpdb->prefix}options WHERE option_name = %s", $option_nm ), 'ARRAY_A' );
		}
	
		if ( ( !empty( $result_old [0] ) && ! empty( $result_old [0]->option_value ) ) || !empty( $beta_dashboard_privileges ) || $current_user->roles [0] == 'administrator' 
			|| (!empty($current_user_caps) && $current_user_caps == 'administrator' ) ) { //modified cond for client fix
	
			$this->add_menu();
		}
	}

	

	public function on_admin_init() {
		global $wp_version,$wpdb;
	
		$this->get_dashboards();
		$this->get_views();

		$plugin = plugin_basename( SM_PLUGIN_FILE );
		$old_plugin = 'smart-manager/smart-manager.php';
		if (is_plugin_active( $old_plugin )) {
			deactivate_plugins( $old_plugin );
			$action_url = "plugins.php?action=activate&plugin=$plugin&plugin_status=all&paged=1";
			$url = wp_nonce_url( $action_url, 'activate-plugin_' . $plugin );
			update_option( 'recently_activated', array ($plugin => time() ) + ( array ) get_option( 'recently_activated' ) );
			
			if (headers_sent())
				echo "<meta http-equiv='refresh' content='" . esc_attr( "0;url=plugins.php?deactivate=true&plugin_status=$status&paged=$page" ) . "' />";
			else {
				wp_redirect( str_replace( '&amp;', '&', $url ) );
				exit();
			}
		}
	
		// Including Scripts for using the wordpress new media manager
		if (version_compare ( $wp_version, '3.5', '>=' )) {
			define ( 'IS_WP35', true);
	
			if ( !empty( $_GET['page'] ) && ( 'smart-manager' === $_GET['page'] || 'smart-manager-settings' === $_GET['page'] ) ) {
				wp_enqueue_media();
				wp_enqueue_script( 'custom-header' );
				// wp_enqueue_script( 'media-upload' );
			}
			
		}
	
		//Flag for handling changes since WP 4.0+
		if (version_compare ( $wp_version, '4.0', '>=' )) {
			define ( 'IS_WP40', true);
		}
	}

	// Function to handle SM admin notices
	function add_admin_notices() {

		if( !( !empty( $_GET['page'] ) && ( 'smart-manager' === $_GET['page'] ) ) ) {
			return;
		}

		if (SMPRO === false) {
			$this->add_promo_notices();
		}
	}

	// Function to handle SM In App Promo
	function add_promo_notices() {

		if ( !empty($_GET['page']) && ( 'smart-manager' === $_GET['page'] ) ) {
			
			$sm_dismiss_admin_notice = '';
			$sm_promo_msg = '';

			$sm_lite_activation_date = get_option( 'sm_lite_activation_date', false );
			$timezone_format = _x('Y-m-d H:i:s', 'timezone date format');
			$current_wp_date = date_i18n($timezone_format);

			if ( $sm_lite_activation_date === false ) {
				$sm_lite_activation_date = $current_wp_date;
				add_option('sm_lite_activation_date',$sm_lite_activation_date);
				add_option('_sm_update_418_date',$sm_lite_activation_date);
			} else {
				$sm_lite_activation_date = get_option( '_sm_update_418_date', false );
				if( false === $sm_lite_activation_date ) {
					$sm_lite_activation_date = $current_wp_date;
					add_option('_sm_update_418_date',$sm_lite_activation_date);
				}
			}

			$date_diff = floor(( strtotime($current_wp_date) - strtotime( $sm_lite_activation_date ) ) / (3600 * 24) );

			$is_pro_available = $this->is_pro_available();

			if ( 'smart-manager' === $_GET['page'] && $is_pro_available === false && ( ! defined('SA_OFFER_VISIBLE') || ( defined('SA_OFFER_VISIBLE') && SA_OFFER_VISIBLE === false ) ) ) {

				$sm_inline_update_count = get_option( 'sm_inline_update_count', 0 );

				$current_user = wp_get_current_user();
				if ( ! $current_user->exists() ) {
					return;
				}
				$sm_current_user_display_name = $current_user->display_name;
				if ( empty( $sm_current_user_display_name ) ) {
					$sm_current_user_display_name = 'there';
				}

				if( false !== get_option( 'sm_dismiss_admin_notice', false ) ) {
					delete_option( 'sm_dismiss_admin_notice' );
				}

				echo '<style type="text/css">
						.sm_design_notice {
							display: none;
							width: 60%;
							background-color: #FFF !important;
							margin-top: 1em !important;
							margin-bottom: 1em !important;
							padding: 1em;
							box-shadow: 0 0 7px 0 rgba(0, 0, 0, .2);
							font-size: 1.1em;
							border: 0.25em solid #753d81;
							margin: 0 auto;
							text-align: center;
						}
						.sm_main_headline {
							font-size: 1.7em;
							font-weight: bold;
							padding-bottom: 1em;
							color: #753d81;
						}
						.sm_main_headline .dashicons.dashicons-awards {
							font-size: 1.2em;
							color: #b8860b;
							width: unset;
							line-height: 0.75em;
						}
						.sm_sub_headline {
							padding-bottom: 1em;
							font-size: 1.2em;
							color: #2d3e50;
							line-height: 1.3em;
						}
					</style>

					<div class="sm_design_notice">
						<div class="sm_container">
							<div class="sm_main_headline"><span class="dashicons dashicons-awards"></span>'. sprintf( __( 'Hey %1s, you just unlocked %2s Off on Smart Manager Pro!', 'smart-manager-for-wp-e-commerce' ), $sm_current_user_display_name, __( "25%", "smart-manager-for-wp-e-commerce" ) ) .'</div>
							<div class="sm_sub_headline">' . sprintf( __( '%s to check Smart Manager Pro features and claim your discount.', 'smart-manager-for-wp-e-commerce' ), '<a href="'. admin_url( 'admin.php?page=smart-manager-pricing' ) .'">' . __( 'Click here', 'smart-manager-for-wp-e-commerce' ) . '</a>' ) .'</div>
						</div>
					</div>';

			}
		}
	}

	// Function to dequeue unwanted scripts on Smart Manager page.
	public function sa_sm_dequeue_scripts() {
		global $wp_scripts;
		
		if ( is_admin() && !empty( $_GET['page'] ) && ( 'smart-manager' === $_GET['page'] || 'smart-manager-settings' === $_GET['page'] ) ) {
			$dequeue_handles = array( 'wpml-tm-progressbar', 'wpml-tm-scripts', 'toolset-utils' );
			foreach( $wp_scripts->registered as $script ) {
				$handle = $script->handle;
				if( false !== stripos($handle, 'select2') || false !== in_array( $handle, $dequeue_handles ) ){
					if ( wp_script_is( $handle ) ) {
						wp_dequeue_script( $handle );
						wp_deregister_script( $handle );
					}		
				}
			}
		}
	}

	public function enqueue_admin_scripts() {

		global $wp_version, $wpdb, $current_user;

		if( !empty( $_GET['landing-page'] ) || !( !empty( $_GET['page'] ) && 'smart-manager' === $_GET['page'] ) ) {
			return;
		}

		if ( !wp_script_is( 'jquery' ) ) {
			wp_enqueue_script( 'jquery' );
		}

		if ( !wp_script_is( 'underscore' ) ) {
			wp_enqueue_script( 'underscore' );
		}

		if ( function_exists('wp_enqueue_editor') ) {
			wp_enqueue_editor();
		}
		
		$deps = array('jquery', 'jquery-ui-core' , 'jquery-ui-widget' , 'jquery-ui-accordion' , 'jquery-ui-autocomplete' , 'jquery-ui-button' , 'jquery-ui-datepicker' ,
						'jquery-ui-dialog' , 'jquery-ui-draggable' , 'jquery-ui-droppable' , 'jquery-ui-menu' , 'jquery-ui-mouse' , 'jquery-ui-position' , 'jquery-ui-progressbar'
						, 'jquery-ui-selectable' , 'jquery-ui-resizable' , 'jquery-ui-sortable' , 'jquery-ui-slider' , 'jquery-ui-tooltip' ,'jquery-ui-tabs' , 'jquery-ui-spinner' , 
						'jquery-effects-core' , 'jquery-effects-blind' , 'jquery-effects-bounce' , 'jquery-effects-clip' , 'jquery-effects-drop' ,
						'jquery-effects-explode' , 'jquery-effects-fade' , 'jquery-effects-fold' , 'jquery-effects-highlight' , 'jquery-effects-pulsate' , 'jquery-effects-scale' ,
						'jquery-effects-shake' , 'jquery-effects-slide' , 'jquery-effects-transfer', 'underscore');

		if ( isset($_GET['page']) && $_GET['page'] == "smart-manager" ) {
			wp_register_script ( 'sm_select2', plugins_url ( '/assets/js/select2/select2.full.min.js', SM_PLUGIN_FILE ), $deps, '4.0.5' );
			wp_enqueue_script( 'sm_select2' );
			if( isset( $_GET['sm-settings'] ) ){
				return;
			}
		}
					
		//Registering scripts for jqgrid lib.
	//       wp_register_script ( 'sm_jquery_ui_multiselect', plugins_url ( '/assets/js/jqgrid/ui.multiselect.js', SM_PLUGIN_FILE ), $deps, '1.10.2' );
		// wp_register_script ( 'sm_jqgrid_locale', plugins_url ( '/assets/js/jqgrid/grid.locale-en.js', SM_PLUGIN_FILE ), array ('sm_jquery_ui_multiselect'), '1.10.2' );
		// wp_register_script ( 'sm_select2', plugins_url ( '/assets/js/select2/select2.full.min.js', SM_PLUGIN_FILE ), $deps, '4.0.5' );
		// wp_register_script ( 'sm_jsoneditor', plugins_url ( '/assets/js/jsoneditor/jsoneditor.min.js', SM_PLUGIN_FILE ), array ('sm_select2'), '5.29.1' );
		// wp_register_script ( 'sm_handsontable', plugins_url ( '/assets/js/handsontable/handsontable.full.min.js', SM_PLUGIN_FILE ), array ('sm_jsoneditor'), '6.2.0' );
		// wp_register_script ( 'sm_handsontable_select2', plugins_url ( '/assets/js/handsontable/select2-editor.js', SM_PLUGIN_FILE ), array ('sm_handsontable'), '6.2.0' );
		// wp_register_script ( 'sm_chosen', plugins_url ( '/assets/js/chosen/chosen.jquery.min.js', SM_PLUGIN_FILE ), array ('sm_handsontable_select2'), '1.3.0' );
		// wp_register_script ( 'sm_sortable', plugins_url ( '/assets/js/sortable/sortable.min.js', SM_PLUGIN_FILE ), array ('sm_chosen'), '1.8.1' );

		//Registering scripts for visualsearch lib.
		wp_register_script ( 'sm_visualsearch_dependencies_beta', plugins_url ( '/assets/js/visualsearch/backbone.js', SM_PLUGIN_FILE ), $deps, $this->version );
		wp_register_script ( 'sm_search_beta', plugins_url ( '/assets/js/visualsearch/search.js', SM_PLUGIN_FILE ), array ('sm_visualsearch_dependencies_beta'), $this->version );


		$last_reg_script = 'sm_search_beta';

		//Code for loading custom js automatically
		$custom_lib_js_lite = glob( $this->plugin_path .'/assets/js/*/*.js' );
		$custom_lib_js_pro = ( SMPRO === true ) ? glob( $this->plugin_path .'/pro/assets/js/*/*.js' ) : array();
		$custom_lib_js = ( !empty( $custom_lib_js_pro ) && SMPRO === true ) ? array_merge( $custom_lib_js_lite, $custom_lib_js_pro ) : $custom_lib_js_lite;

		if( !empty( $custom_lib_js ) ) {
			$index = 0;

			foreach ( $custom_lib_js as $file ) {

				$folder_path = substr($file, 0, (strrpos($file, '/', -3)));
				$folder_name = substr($folder_path, (strrpos($folder_path, '/', -3) + 1));

				if( 'visualsearch' === $folder_name ) {
					continue;
				}

				$pro_flag = ( !empty( $custom_lib_js_pro ) && in_array($file, $custom_lib_js_pro) ) ? 'pro' : '';

				$file_nm = 'sm_'. ( !empty( $pro_flag ) ? $pro_flag.'_' : '' ) .'custom_'.preg_replace('/[\s\-.]/','_',substr($file, (strrpos($file, '/', -3) + 1)));

				if ( $file_nm == 'sm_pro_custom_smart_manager_js' ) {
					continue;
				}		
		
				wp_register_script ( $file_nm, plugins_url ( ( !empty( $pro_flag ) ? '/'.$pro_flag : '' ).'/assets/js/'.$folder_name.'/'.substr($file, (strrpos($file, '/', -3) + 1)), SM_PLUGIN_FILE ), array ($last_reg_script), $this->version );
				
				$last_reg_script = $file_nm;
				$index++;
			}
		}

		wp_register_script ( 'sm_custom_smart_manager_js', plugins_url ( '/assets/js/smart-manager.js', SM_PLUGIN_FILE ), array ($last_reg_script), $this->version );
		$last_reg_script = 'sm_custom_smart_manager_js';

		if( SMPRO === true ) {
			wp_register_script ( 'sm_pro_custom_smart_manager_js', plugins_url ( '/pro/assets/js/smart-manager.js', SM_PLUGIN_FILE ), array ($last_reg_script), $this->version );
			$last_reg_script = 'sm_pro_custom_smart_manager_js';
		}

		// Code for loading custom js automatically
		$custom_js = glob( $this->plugin_path .'/assets/js/*.js' );
		$index = 0;

		foreach ( $custom_js as $file ) {

			$file_nm = 'sm_custom_'.preg_replace('/[\s\-.]/','_',substr($file, (strrpos($file, '/', -3) + 1)));

			if ( $file_nm == 'sm_custom_smart_manager_js' ) {
				continue;
			}

			if ( empty($last_reg_script) && $index == 0 ) {
				wp_register_script ( $file_nm, plugins_url ( '/assets/js/'.substr($file, (strrpos($file, '/', -3) + 1)), SM_PLUGIN_FILE ), array ('sm_custom_smart_manager_js'), $this->version );
			} else {	        		
				wp_register_script ( $file_nm, plugins_url ( '/assets/js/'.substr($file, (strrpos($file, '/', -3) + 1)), SM_PLUGIN_FILE ), array ($last_reg_script), $this->version );
			}

			$last_reg_script = $file_nm;
			$index++;
		}

		//Updating The Files Recieved in SM Beta
		$successful = ($this->updater * $this->upgrade)/$this->updater;

		// Code for loading custom js for PRO automatically
		if( SMPRO === true ) {
			$custom_js = glob( $this->plugin_path .'/pro/assets/js/*.js' );

			foreach ( $custom_js as $file ) {

				$file_nm = 'sm_pro_custom_'.preg_replace('/[\s\-.]/','_',substr($file, (strrpos($file, '/', -3) + 1)));

				if ( $file_nm == 'sm_pro_custom_smart_manager_js' ) {
					continue;
				}

				wp_register_script ( $file_nm, plugins_url ( '/pro/assets/js/'.substr($file, (strrpos($file, '/', -3) + 1)), SM_PLUGIN_FILE ), array ($last_reg_script), $this->version );

				$last_reg_script = $file_nm;
				$index++;
			}
		}

		$sm_dashboard_keys = ( !empty( $this->sm_dashboards_final ) ) ? array_keys($this->sm_dashboards_final) : array('');

		// set the default dashboard
		$search_type = get_transient( 'sa_sm_'.$current_user->user_email.'_search_type' );
		
		$recent_dashboards = get_option('sm_wp_dashboard_post_type_'.get_current_user_id(), false);
		$is_redirect = false;

		if( empty( $recent_dashboards ) ) {
			$recent_dashboards = get_user_meta( get_current_user_id(), 'sa_sm_recent_post_types', true );
			if( empty( $recent_dashboards ) ){
				$key = 'sa_sm_'.$current_user->user_email.'_default_dashboard';
				$recent_dashboards = get_transient( $key );
				if( ! empty( $recent_dashboards ) ) {
					update_user_meta( get_current_user_id(), 'sa_sm_recent_post_types', array( $recent_dashboards ) );
					delete_transient( $key );
				}
			}
		} else {
			$is_redirect = true;
			sa_sm_update_recent_dashboards( 'post_types', $recent_dashboards );
			$recent_dashboards = get_user_meta( get_current_user_id(), 'sa_sm_recent_post_types', true );
			delete_option('sm_wp_dashboard_post_type_'.get_current_user_id());
		}

		if( ! empty( $recent_dashboards ) && ! is_array( $recent_dashboards ) ){
			$recent_dashboards = array( $recent_dashboards );
		}

		// Code to set default if recent dashboards is blank
		if( empty( $recent_dashboards ) ){
			$recent_dashboards = array( (is_plugin_active( 'woocommerce/woocommerce.php' ) && !empty( $this->sm_dashboards_final['product'] ) ) ? 'product' : $sm_dashboard_keys[0] );
		}

		$recent_dashboard_type = get_user_meta( get_current_user_id(), 'sa_sm_recent_dashboard_type', true );

		$recent_views = get_option('sm_wp_dashboard_view_'.get_current_user_id(), false);
		
		if( empty( $recent_views ) ) {
			$recent_views = get_user_meta( get_current_user_id(), 'sa_sm_recent_views', true );
		} else {
			sa_sm_update_recent_dashboards( 'views', $recent_views );
			$recent_views = get_user_meta( get_current_user_id(), 'sa_sm_recent_views', true );
			delete_option('sm_wp_dashboard_view_'.get_current_user_id());
			$recent_dashboard_type = 'view';
		}

		//Updating The Files Recieved in SM Beta
		$deleted_sucessfull = ( ($this->dupdater * $this->dupgrade)/$this->dupdater ) * 2;

		$this->sm_dashboards_final ['sm_nonce'] = wp_create_nonce( 'smart-manager-security' );

		//setting limit for the records to be displayed
		$record_per_page = get_option( '_sm_beta_set_record_limit' );

		if( empty($record_per_page) ) {
			update_option('_sm_beta_set_record_limit', '50');
			$record_per_page = '50';
		}

		$batch_background_process = false;
		$background_process_name = '';

		if( SMPRO === true ) {
			$batch_background_process = get_site_option('sm_beta_background_process_status', false);
			$background_process_params = get_transient('sm_beta_background_process_params');
			$background_process_name = (!empty($background_process_params['process_name'])) ? $background_process_params['process_name'] : '';
		}

		$lite_dashboards = array('product', 'shop_order', 'shop_coupon', 'post');

		$trash_enabled = true;
		if( defined('EMPTY_TRASH_DAYS') ){
			if( 0 == EMPTY_TRASH_DAYS ) {
				$trash_enabled = false;
			}
		}

		//Filter for disabling the 'Delete Permanently' functionality
		$disable_delete_permanently = apply_filters('sm_beta_disable_delete_permanently', false);
		$delete_permanently_disable_message = apply_filters('sm_beta_delete_permanently_disable_message', __( 'Delete Permanently is disabled. Please contact store administrator for enabling the same.', 'smart-manager-for-wp-e-commerce'));

		$sm_beta_params = array( 
							'sm_dashboards' => json_encode($this->sm_dashboards_final),
							'sm_views' => json_encode($this->sm_accessible_views),
							'sm_owned_views' => json_encode( $this->sm_owned_views ),
							'sm_public_views' => json_encode( $this->sm_public_views ),
							'sm_view_post_types' => json_encode( $this->sm_view_post_types ),
							'recent_dashboards' => json_encode( $recent_dashboards ),
							'recent_views' => json_encode( $recent_views ),
							'recent_dashboard_type' => $recent_dashboard_type,
							'sm_dashboards_public' => json_encode($this->sm_public_dashboards),
							'SM_IS_WOO36' => self::$sm_is_woo36,
							'SM_IS_WOO30' => self::$sm_is_woo30,
							'SM_IS_WOO22' => self::$sm_is_woo22,
							'SM_IS_WOO21' => self::$sm_is_woo21,
							'SM_BETA_PRO' => SMPRO,
							'record_per_page' => $record_per_page,
							'sm_admin_email' => get_option('admin_email'),
							'batch_background_process' => $batch_background_process,
							'background_process_name' => $background_process_name,
							'updated_sucessfull' => $successful,
							'deleted_sucessfull' => $deleted_sucessfull,
							'updated_msg' => $this->update_msg.' more',
							'success_msg' => $this->success_msg,
							'lite_dashboards' => json_encode($lite_dashboards),
							'is_settings_page' => ( isset( $_GET['sm-settings'] ) ? true : false ),
							'search_type' => ( ( !empty( $search_type ) ) ? $search_type : 'simple' ),
							'wpdb_prefix' => $wpdb->prefix,
							'trashEnabled' => $trash_enabled,
							'background_process_running_message' => __( 'In the meanwhile, you can use Smart Manager. But before using actions like ', 'smart-manager-for-wp-e-commerce') .' <strong>'. __( 'Bulk Edit', 'smart-manager-for-wp-e-commerce') .'</strong>/ <strong>'. __('Duplicate Records', 'smart-manager-for-wp-e-commerce') .'</strong>/ <strong>'. __( 'Delete Records', 'smart-manager-for-wp-e-commerce') .'</strong>, '. __('you will have to wait for the current background process to finish.', 'smart-manager-for-wp-e-commerce' ),
							'delete_permanently' => array( 'disable' => $disable_delete_permanently, 'error_message' => $delete_permanently_disable_message )
						);

		$active_plugins = (array) get_option( 'active_plugins', array() );

		if ( is_multisite() ) {
			$active_plugins = array_merge( $active_plugins, get_site_option( 'active_sitewide_plugins', array() ) );
		}

		if ( ( in_array( 'woocommerce/woocommerce.php', $active_plugins, true ) || array_key_exists( 'woocommerce/woocommerce.php', $active_plugins ) ) ) {
			$sm_beta_params['woo_price_decimal_places'] = wc_get_price_decimals();
			$sm_beta_params['woo_price_decimal_separator'] = wc_get_price_decimal_separator();
		}


		wp_localize_script( 'sm_custom_smart_manager_js', 'sm_beta_params', $sm_beta_params );

		wp_enqueue_script( $last_reg_script );

		// Including Scripts for using the wordpress new media manager
		if (version_compare ( $wp_version, '3.5', '>=' )) {
			if ( isset($_GET['page']) && ($_GET['page'] == "smart-manager" || $_GET['page'] == "smart-manager-settings")) {
				wp_enqueue_media();
				wp_enqueue_script( 'custom-header' );
			}
		}

		do_action('smart_manager_enqueue_scripts'); //action for hooking any scripts
	}

	function enqueue_admin_styles() {

		if( !empty( $_GET['landing-page'] ) || !( !empty( $_GET['page'] ) && 'smart-manager' === $_GET['page'] ) ) {
			return;
		}

		wp_enqueue_style( 'wp-jquery-ui-dialog' );
		
		//Registering styles for visualsearch lib.
		wp_register_style ( 'sm_beta_search_reset', plugins_url ( '/assets/js/visualsearch/reset.css', SM_PLUGIN_FILE ), array (), $this->version );
		wp_register_style ( 'sm_beta_search_icons', plugins_url ( '/assets/js/visualsearch/icons.css', SM_PLUGIN_FILE ), array ('sm_beta_search_reset'), $this->version );
		wp_register_style ( 'sm_beta_search_workspace', plugins_url ( '/assets/js/visualsearch/workspace.css', SM_PLUGIN_FILE ), array ('sm_beta_search_icons'), $this->version );

		//Code for loading custom js for PRO automatically
		$custom_css_lite = glob( $this->plugin_path .'/assets/css/*/*.css' );
		$custom_css_pro = array();
		if( SMPRO === true ) {
			$custom_css = glob( $this->plugin_path .'/pro/assets/css/*.css' );
			$custom_lib_css = glob( $this->plugin_path .'/pro/assets/css/*/*.css' );
			$custom_css_pro = array_merge($custom_lib_css,$custom_css);
		}

		$custom_css = ( !empty( $custom_css_pro ) ) ? array_merge($custom_css_lite, $custom_css_pro) : $custom_css_lite;

		if( !empty( $custom_css ) ) {
			$index = 0;
			$last_reg_script = 'sm_beta_search_workspace';
			foreach ( $custom_css as $file ) {

				$folder_name = '';

				$folder_path = substr($file, 0, (strrpos($file, '/', -3)));
				$folder_name = substr($folder_path, (strrpos($folder_path, '/', -3) + 1));

				$pro_flag = ( !empty( $custom_css_pro ) && in_array($file, $custom_css_pro) ) ? 'pro' : '';

				$file_nm = 'sm_'. ( !empty( $pro_flag ) ? $pro_flag.'_' : '' ) .'custom_'.preg_replace('/[\s\-.]/','_',substr($file, (strrpos($file, '/', -3) + 1)));

				if( $file_nm == 'sm_pro_custom_smart_manager_css' ) {
					continue;
				}

				wp_register_style ( $file_nm, plugins_url ( ( !empty( $pro_flag ) ? '/'.$pro_flag : '' ).'/assets/css/'.$folder_name.'/'.substr($file, (strrpos($file, '/', -3) + 1)), SM_PLUGIN_FILE ), array($last_reg_script), $this->version );

				$last_reg_script = $file_nm;
				$index++;
			}
		}

		wp_register_style ( 'sm_main_style', plugins_url ( '/assets/css/smart-manager.css', SM_PLUGIN_FILE ), array($last_reg_script), $this->version );			
		$last_reg_script = 'sm_main_style';

		if( SMPRO === true ) {
			wp_register_style ( 'sm_pro_main_style', plugins_url ( '/pro/assets/css/smart-manager.css', SM_PLUGIN_FILE ), array($last_reg_script), $this->version );			
			$last_reg_script = 'sm_pro_main_style';
		}

		wp_enqueue_style( $last_reg_script );

		do_action('smart_manager_enqueue_scripts');	//action for hooking any styles
	}

	function get_latest_version() {
		$sm_plugin_info = get_site_transient( 'update_plugins' );
		$latest_version = isset( $sm_plugin_info->response [SM_PLUGIN_BASE_NM]->new_version ) ? $sm_plugin_info->response [SM_PLUGIN_BASE_NM]->new_version : '';
		return $latest_version;
	}

	function get_user_sm_version() {
		$sm_plugin_info = get_plugins();
		$user_version = $sm_plugin_info [SM_PLUGIN_BASE_NM] ['Version'];
		return $user_version;
	}

	function is_pro_updated() {
		$user_version = $this->get_user_sm_version();
		$latest_version = $this->get_latest_version();
		return version_compare( $user_version, $latest_version, '>=' );
	}

	// function for removing the Help Tab
	function remove_help_tab(){
		//condition to remove the help tab only from SM pages
		if( !empty($_GET['page']) && 'smart-manager' === $_GET['page'] ) {
			$screen = get_current_screen();
			$screen->remove_help_tabs();
		}
	}

	//Function to re-update to Pro in case of Pro to Lite
	function update_to_pro() {
		
		$sm_download_url = $this->get_pro_download_url();

		if ( ! empty( $sm_download_url ) ) {

			include_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

			$skin     = new WP_Ajax_Upgrader_Skin();
			$upgrader = new Plugin_Upgrader( $skin );

			$result = $upgrader->run( array(
				'package'           => $sm_download_url,
				'destination'       => WP_PLUGIN_DIR,
				'clear_destination' => true,
				'clear_working'     => true,
				'hook_extra'        => array(
											'plugin' => 'smart-manager-for-wp-e-commerce/smart-manager.php',
											'type'   => 'plugin',
											'action' => 'update',
										),
			) );

			if( !empty($result) ) {
				die('Success');	
			} else {
				die('Failed');
			}
			
		}
	}

	// Function to show upgrade notifications
	function show_upgrade_notifications() {

		?>
			<script type="text/javascript">
	
					jQuery(document).ready(function(){
						var current_url = "<?php echo admin_url('admin.php?&page=smart-manager'); ?>";
						jQuery('.request-filesystem-credentials-dialog-content').find('form').attr('action',current_url+'&action=sm_update_to_pro');
	
						jQuery('.request-filesystem-credentials-dialog-content').find('form').on('submit', function(e){
							e.preventDefault();
	
							jQuery( '#request-filesystem-credentials-dialog' ).hide();
							jQuery( 'body' ).removeClass( 'modal-open' );
	
							var params = jQuery(this).serializeArray();
	
							setTimeout(function(){ jQuery.ajax({
														type : 'POST',
														url: (ajaxurl.indexOf('?') !== -1) ? ajaxurl + '&action=sm_update_to_pro' : ajaxurl + '?action=sm_update_to_pro',
														dataType:"text",
														async: false,
														data: params,
														success: function(response) {
															jQuery('#sm_pro_to_lite_msg').removeClass('notice-error').addClass('notice-success').html('<div style="margin:.5em 0;"><?php echo __( 'Upgraded Successfully!!!', SM_TEXT_DOMAIN ); ?></div>');
	
															// Remove navigation prompt
															window.onbeforeunload = null;
	
															setTimeout(function(){ window.location.replace(current_url); }, 3000);
														}
													});
								}, 1000);
							
						});
					});
	
					jQuery(document).on('click','#sm_update_to_pro_link',function(e){
						e.preventDefault();
	
						var current_url = "<?php echo admin_url('admin.php?&page=smart-manager'); ?>";
						var $modal = jQuery( '#request-filesystem-credentials-dialog' );
						jQuery('#sm_pro_to_lite_msg_hidden').html(jQuery('#sm_pro_to_lite_msg').html());
						jQuery('#sm_pro_to_lite_msg').html('<div style="margin:.5em 0;"><span style="margin-right:6px;color:#f56e28;animation:rotation 2s infinite linear;" class="dashicons dashicons-update"></span><?php echo __( 'Upgrading to Smart Manager Pro...', SM_TEXT_DOMAIN ); ?></div>');
	
						// Enable navigation prompt
						window.onbeforeunload = function() {
							return true;
						};
	
						setTimeout(function(){ jQuery.ajax({
									type : 'POST',
									url: (ajaxurl.indexOf('?') !== -1) ? ajaxurl + '&action=sm_update_to_pro' : ajaxurl + '?action=sm_update_to_pro',
									dataType:"text",
									async: false,
									success: function(response) {
	
										if( response == 'Success' ) {
											jQuery('#sm_pro_to_lite_msg').removeClass('notice-error').addClass('notice-success').html('<div style="margin:.5em 0;"><?php echo __( 'Upgraded Successfully!!!', SM_TEXT_DOMAIN ); ?></div>');
											
											// Remove navigation prompt
											window.onbeforeunload = null;
											
											setTimeout(function(){ window.location.replace(current_url); }, 3000);
										} else {
											jQuery( 'body' ).addClass( 'modal-open' );
											$modal.show();
											$modal.find( 'input:enabled:first' ).focus();
										}
									}
								});
						}, 1000);
							
					});
	
					jQuery(document).on('click', '[data-js-action="close"], .notification-dialog-background',function(e){
						e.preventDefault();
	
						// Remove navigation prompt
						window.onbeforeunload = null;
	
						jQuery('#sm_pro_to_lite_msg').html(jQuery('#sm_pro_to_lite_msg_hidden').html());
	
						jQuery( '#request-filesystem-credentials-dialog' ).hide();
						jQuery( 'body' ).removeClass( 'modal-open' );
	
					});
	
		</script>
	
		<?php
			$is_pro_available = $this->is_pro_available();
			if( $is_pro_available === true ) { ?>
	
				<div id="sm_pro_to_lite_msg" class="update-message notice inline notice-error notice-alt" style="display:block !important;">
					<p>
						<?php
							printf( ('<b>' . __( 'Oops!', SM_TEXT_DOMAIN ) . '</b> ' . __( 'Seems like your Smart Manager plugin has downgraded to the Lite version. ', SM_TEXT_DOMAIN ) . " " . '<a id="sm_update_to_pro_link" href="">' . " " .__( 'Click here', SM_TEXT_DOMAIN ) . '</a> ')." ".__( 'to', SM_TEXT_DOMAIN )." <b>".__( 'convert it back to the Pro version.', SM_TEXT_DOMAIN )."</b>" );
						?>
					</p>
				</div>
				<div id="sm_pro_to_lite_msg_hidden" style="display:none;"></div>
	
				<?php
	
			} else if ( SMPRO === false && get_option('sm_dismiss_admin_notice') == '1') { ?>
					<div id="message" class="updated fade" style="display:block !important;">
						<p> <?php
								printf( ('<b>' . __( 'Important:', SM_TEXT_DOMAIN ) . '</b> ' . __( 'Upgrade to Pro to get features like \'<i>Manage any Custom Post Type</i>\' , \'<i>Bulk Edit</i>\' , \'<i>Export CSV </i>\' , \'<i>Duplicate Products</i>\' &amp; many more...', SM_TEXT_DOMAIN ) . " " . '<br /><a href="%1s" target=_storeapps>' . " " .__( 'Learn more about Pro version', SM_TEXT_DOMAIN ) . '</a> ' . __( 'or take a', SM_TEXT_DOMAIN ) . " " . '<a href="%2s" target=_livedemo>' . " " . __( 'Live Demo', SM_TEXT_DOMAIN ) . '</a>'), 'https://www.storeapps.org/product/smart-manager', 'http://demo.storeapps.org/?demo=sm-woo' );							
							?>
						</p>
					</div>
				<?php
			} 
	}

	//function for showing the sm page
	function show_console_beta() {
	
		global $wpdb;

		$latest_version = $this->get_latest_version();
		$is_pro_updated = $this->is_pro_updated();

		?>
		<div class="wrap" style="margin: 0!important;">
			<style>
				div#TB_window {
					background: lightgrey;
				}
			</style>    
			<?php if ( SMPRO === true && function_exists( 'smart_support_ticket_content' ) ) smart_support_ticket_content();  ?>    
				
			<div id="sm_nav_bar" style="margin-bottom:1em;">
				<div class='sm_beta_left'>	
					<span class="sm-h2">
					<?php
							echo 'Smart Manager ';
							echo '<sup style="vertical-align: super;background-color: #EC8F1C;font-size: 0.6em !important;color: white;padding: 2px 3px;border-radius: 2px;font-weight: 600;"><span>'.((SMPRO === true) ? 'PRO' : 'LITE').'</span></sup>';
							$plug_page = '';
							
					?>
					</span>
				</div>
				<span id="sm_nav_bar_right" style="float: right; line-height: 3.5em;"> <?php
					if ( SMPRO === true && ! is_multisite() ) {
						$plug_page .= '<a href="admin.php?page=smart-manager&sm-settings">Settings</a>';
					} else {
						$plug_page = '';
					}
					
					printf ( __ ( '%1s' , 'smart-manager-for-wp-e-commerce'), $plug_page );
					?>
				</span>
			</div>
		</div>
		<?php
			if (! $is_pro_updated) {
				?> <?php
				$admin_url = SM_ADMIN_URL . "plugins.php";
				$update_link = __( 'An upgrade for Smart Manager Pro', 'smart-manager-for-wp-e-commerce' ) . " " . $latest_version . " " . __( 'is available.', 'smart-manager-for-wp-e-commerce' ) . " " . "<a align='right' href=$admin_url>" . __( 'Click to upgrade.', 'smart-manager-for-wp-e-commerce' ) . "</a>";
				$this->display_notice( $update_link );
				?> <?php
			}

			if( function_exists('show_upgrade_notifications') ) {
				$this->show_upgrade_notifications();
			}
		?>

			<div id="sm_editor_grid" ></div>
			
			<div id="sm_pagging_bar"></div>
				
			<div id="sm_inline_dialog"></div>

			<div class="sm-loader-container">
				<div class="sm-loader">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>

			<?php
		
	}

	/**
	 * Smart Manager's Support Form
	 */
	public function smart_manager_support_ticket_content() {

		if ( !( !empty( $_GET['page'] ) && ( 'smart-manager' === $_GET['page'] || 'smart-manager-settings' === $_GET['page'] ) ) ) {
			return;
		}

		if ( !wp_script_is('thickbox') ) {
			if (!function_exists('add_thickbox')) {
				require_once ABSPATH . 'wp-includes/general-template.php';
			}
			add_thickbox();
		}

		if ( ! method_exists( 'StoreApps_Upgrade_3_7', 'support_ticket_content' ) ) return;

		$plugin_data = get_plugin_data( self::$plugin_file );
		$license_key = get_site_option( self::$prefix.'_license_key' );

		StoreApps_Upgrade_3_7::support_ticket_content( 'sa_smart_manager_beta', self::$sku, $plugin_data, $license_key, 'smart-manager-for-wp-e-commerce' );
	}

	public function footer_text( $sm_footer_text ) {
		if ( is_admin() && !empty( $_GET['page'] ) && ( 'smart-manager-woo' === $_GET['page'] || 'smart-manager-wpsc' === $_GET['page'] || ( !empty( $_GET['sm_old'] ) && ( 'woo' === $_GET['sm_old'] || 'wpsc' === $_GET['sm_old'] ) && 'smart-manager' === $_GET['page'] ) || 'smart-manager' === $_GET['page'] || 'smart-manager-settings' === $_GET['page'] || 'smart-manager-pricing' === $_GET['page'] || 'sm-storeapps-plugins' === $_GET['page'] ) ) {
			// $sm_footer_text = __( '<span style="color:#555d66;">Thank you for using <span style="color: #5850EC;">Smart Manager</span>. A huge thank you from <span style="color: #5850EC;">StoreApps</span></span>!', 'smart-manager-for-wp-e-commerce' );
			$sm_footer_text = '';
		}

		return $sm_footer_text;
	}

	function update_footer_text( $sm_version_text ) {

		$sm_plugin_data = get_plugin_data( WP_PLUGIN_DIR.'/smart-manager-for-wp-e-commerce/smart-manager.php' );
		$sm_current_version = $sm_plugin_data['Version'];

		if ( is_admin() && ! empty( $_GET['page'] ) && ( 'smart-manager-woo' === $_GET['page'] || 'smart-manager-wpsc' === $_GET['page'] || ( !empty( $_GET['sm_old'] ) && ( 'woo' === $_GET['sm_old'] || 'wpsc' === $_GET['sm_old'] ) && 'smart-manager' === $_GET['page'] ) || 'smart-manager' === $_GET['page'] || 'smart-manager-settings' === $_GET['page'] || 'smart-manager-pricing' === $_GET['page'] || 'sm-storeapps-plugins' === $_GET['page'] ) ) {
			// $sm_version_text = sprintf( __( 'Smart Manager version: <span style="color: #5850EC;">%s</span>', 'smart-manager-for-wp-e-commerce' ), $sm_current_version );
			$sm_version_text = '';
		}

		return $sm_version_text;
	}

	//Function for showing the sm-privilege settings
	function show_privilege_page() {
		if (file_exists( $this->plugin_path . '/pro/sm-privilege.php' )) {
			include_once ($this->plugin_path . '/pro/sm-privilege.php');
			return;
		} else {
			$error_message = __( "A required Smart Manager file is missing. Can't continue. ", 'smart-manager-for-wp-e-commerce' );
		}
	}

	//function to display notices
	function display_notice($notice) {
		echo "<div class='sm-upgrade-notice'>
					<p>";
		echo _e( $notice, 'smart-manager-for-wp-e-commerce' );
		echo "</p></div>";
	}

	//function to error messages
	function display_err() {
		echo "<div id='notice' class='error'>";
		echo "<b>" . __( 'Error:', 'smart-manager-for-wp-e-commerce' ) . "</b>" . $this->error_message;
		echo "</div>";
	}

	public static function get_data() {
		return get_plugin_data( SM_PLUGIN_FILE );
	}
	
	public static function get_version() {
	
		$version = '';
	
		if ( function_exists('smart_manager_get_data') ) {
			$plugin_data = self::get_data();
			$version = $plugin_data['Version'];
		}
	
		return $version;
	}

	function smart_manager_print_logo() {
		if (get_option('smart_manager_company_logo') != '') {
			return '<img src="' . get_option('smart_manager_company_logo') . '"/>';
		}
	}

	function manage_with_smart_manager() {
		$current_post_type = get_current_screen()->post_type;
		$current_screen_id = get_current_screen()->id;
		
		if ( ( ! empty( $current_post_type ) && 'edit-'.$current_post_type === $current_screen_id ) || 'users' === $current_screen_id  ) {
			$dashboard = ( ( ! empty( $current_post_type ) ) ? $current_post_type : 'user' );
		
			wp_register_script( 'manage_with_sm', plugins_url( '/assets/js/manage-with-smart-manager.js', SM_PLUGIN_FILE ), array(), self::get_version(), true );
			wp_enqueue_script( 'manage_with_sm' );
			$sm_params = array(
				'url' => admin_url( 'admin.php?page=smart-manager' ) . '&dashboard=' . $dashboard,
				'string' => '<img src="' . SM_IMG_URL . 'menu-icon-16x16.png" /> Manage with Smart Manager',
				'active_dashboard' => $dashboard,
			);
			wp_localize_script( 'manage_with_sm', 'manage_with_sm', $sm_params );
			?>
			<style type="text/css">
				.page-title-action.edit-sm {
					background-color: #ffffff;
					border: 1px solid #0e9f6e;
					color: #0e9f6e;
				}
				.page-title-action.edit-sm img {
					vertical-align: sub;
				}
				.page-title-action.edit-sm:hover {
					background: #f1f1f1 !important;
					border-color: #0e9f6e !important;
					color: #0e9f6e !important;
				}
			</style>
			<?php
		}
	}

}

$GLOBALS['smart_manager_beta'] = Smart_Manager::instance();
