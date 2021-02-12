<?php

if ( !defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'Smart_Manager_Pro_Shop_Order' ) ) {
	class Smart_Manager_Pro_Shop_Order extends Smart_Manager_Pro_Base {
		public $dashboard_key = '',
				$req_params = array(),
				$plugin_path = '';

		public $shop_order = '';

		protected static $_instance = null;

		public static function instance($dashboard_key) {
			if ( is_null( self::$_instance ) ) {
				self::$_instance = new self($dashboard_key);
			}
			return self::$_instance;
		}

		function __construct($dashboard_key) {

			parent::__construct($dashboard_key);

			$this->plugin_path  = untrailingslashit( plugin_dir_path( __FILE__ ) );

			if ( file_exists(SM_PLUGIN_DIR_PATH . '/classes/class-smart-manager-shop-order.php') ) {
				include_once SM_PLUGIN_DIR_PATH . '/classes/class-smart-manager-shop-order.php';
				$this->shop_order = new Smart_Manager_Shop_Order( $dashboard_key );
			}			
		}

		public static function actions() {

		}

		public function __call( $function_name, $arguments = array() ) {

			if( empty( $this->shop_order ) ) {
				return;
			}

			if ( ! is_callable( array( $this->shop_order, $function_name ) ) ) {
				return;
			}

			if ( ! empty( $arguments ) ) {
				return call_user_func_array( array( $this->shop_order, $function_name ), $arguments );
			} else {
				return call_user_func( array( $this->shop_order, $function_name ) );
			}
		}


	}

}