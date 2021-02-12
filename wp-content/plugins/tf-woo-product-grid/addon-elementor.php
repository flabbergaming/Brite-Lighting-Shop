<?php
/*
Plugin Name: TF Woo Product Grid Addon For Elementor
Description: The theme's components
Author: Themesflat
Author URI: https://codecanyon.net/user/themesflat
Version: 1.0.0
Text Domain: tf-addon-for-elementer
Domain Path: /languages
License: GNU General Public License v3.0
*/

if (!defined('ABSPATH'))
    exit;

final class TFWoo_Addon_Elementor {

    const VERSION = '1.0.0';
    const MINIMUM_ELEMENTOR_VERSION = '2.0.0';
    const MINIMUM_PHP_VERSION = '5.2';

    private static $_instance = null;

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct() {
        if ( ! function_exists('is_plugin_active') ){ include_once( ABSPATH . 'wp-admin/includes/plugin.php' ); }
        add_action( 'init', [ $this, 'i18n' ] );
        add_action( 'plugins_loaded', [ $this, 'init' ] );
        
        add_action( 'elementor/frontend/after_register_styles', [ $this, 'widget_styles' ] , 100 );
        add_action( 'admin_enqueue_scripts', [ $this, 'widget_styles' ] , 100 );
        add_action( 'elementor/frontend/after_register_scripts', [ $this, 'widget_scripts' ], 100 );
    }

    public function i18n() {
        load_plugin_textdomain( 'tf-addon-for-elementer', false, basename( dirname( __FILE__ ) ) . '/languages' );
    }

    public function init() {
        // Check if Elementor installed and activated        
        if ( ! did_action( 'elementor/loaded' ) ) {
            add_action( 'admin_notices', [ $this, 'tf_admin_notice_missing_main_plugin' ] );
            return;
        }

        // Check for required Elementor version
        if ( ! version_compare( ELEMENTOR_VERSION, self::MINIMUM_ELEMENTOR_VERSION, '>=' ) ) {
            add_action( 'admin_notices', [ $this, 'admin_notice_minimum_elementor_version' ] );
            return;
        }

        // Check for required PHP version
        if ( version_compare( PHP_VERSION, self::MINIMUM_PHP_VERSION, '<' ) ) {
            add_action( 'admin_notices', [ $this, 'admin_notice_minimum_php_version' ] );
            return;
        }

        // Check if  WooCommerce installed and activated 
        if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
            add_action('admin_notices', [ $this, 'tf_admin_notice_missing_woocommerce_plugin' ] );
            return ;
        }

        add_action('admin_notices', [ $this, 'tf_admin_notice_compare_quick_view_wishlist' ] );
        

        // Add Plugin actions
        add_action( 'elementor/widgets/widgets_registered', [ $this, 'init_widgets' ] );
        add_action( 'elementor/controls/controls_registered', [ $this, 'init_controls' ] );

        add_action( 'elementor/elements/categories_registered', function () {
            $elementsManager = \Elementor\Plugin::instance()->elements_manager;
            $elementsManager->add_category(
                'themesflat_addons_wc',
                array(
                  'title' => 'THEMESFLAT ADDONS WC',
                  'icon'  => 'fonts',
            ));
            $elementsManager->add_category(
                'themesflat_addons_wc_single',
                array(
                  'title' => 'THEMESFLAT ADDONS WC SINGLE',
                  'icon'  => 'fonts',
            ));
        });

        require_once plugin_dir_path( __FILE__ ).'inc/function.php';
    }    

    public function tf_admin_notice_missing_main_plugin() {
        if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

        $message = sprintf(
            esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'tf-addon-for-elementer' ),
            '<strong>' . esc_html__( 'TF Woo Product Grid Addon For Elementor', 'tf-addon-for-elementer' ) . '</strong>',
            '<strong>' . esc_html__( 'Elementor', 'tf-addon-for-elementer' ) . '</strong>'
        );

        printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );
    }

    public function admin_notice_minimum_elementor_version() {
        if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );
        $message = sprintf(
            esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'tf-addon-for-elementer' ),
            '<strong>' . esc_html__( 'TF Woo Product Grid Addon For Elementor', 'tf-addon-for-elementer' ) . '</strong>',
            '<strong>' . esc_html__( 'Elementor', 'tf-addon-for-elementer' ) . '</strong>',
             self::MINIMUM_ELEMENTOR_VERSION
        );

        printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

    }

    public function admin_notice_minimum_php_version() {

        if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );
        $message = sprintf(
            esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'tf-addon-for-elementer' ),
            '<strong>' . esc_html__( 'TF Woo Product Grid Addon For Elementor', 'tf-addon-for-elementer' ) . '</strong>',
            '<strong>' . esc_html__( 'PHP', 'tf-addon-for-elementer' ) . '</strong>',
             self::MINIMUM_PHP_VERSION
        );

        printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

    }

    public function tf_admin_notice_missing_woocommerce_plugin(){
        $message = sprintf(
            esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'tf-addon-for-elementer' ),
            '<strong>' . esc_html__( 'TF Woo Product Grid Addon For Elementor', 'tf-addon-for-elementer' ) . '</strong>',
            '<strong>' . esc_html__( 'WooCommerce', 'tf-addon-for-elementer' ) . '</strong>'
        );

        printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );
    }

    public function tf_admin_notice_compare_quick_view_wishlist(){
        require_once( __DIR__ . '/widgets/widget-woo-product-grid.php' );
        $message = sprintf(
            esc_html__( '"%1$s" If you want to use "%2$s" then install the following Plugin.', 'tf-addon-for-elementer' ),
            '<strong>' . esc_html__( 'TF Woo Product Grid Addon For Elementor', 'tf-addon-for-elementer' ) . '</strong>',
            '<strong>' . esc_html__( 'Compare, Quick View, Wishlist', 'tf-addon-for-elementer' ) . '</strong>'
        );

        $button_compare_text = esc_html__( 'Plugin Compare', 'tf-addon-for-elementer' );
        $button_link_compare = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=yith-woocommerce-compare' ), 'install-plugin_yith-woocommerce-compare' );
        $button_quick_view_text = esc_html__( 'Plugin Quick View', 'tf-addon-for-elementer' );
        $button_link_quick_view = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=yith-woocommerce-quick-view' ), 'install-plugin_yith-woocommerce-quick-view');
        $button_wishlist_text = esc_html__( 'Plugin Wishlist', 'tf-addon-for-elementer' );
        $button_link_wishlist = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=yith-woocommerce-wishlist' ), 'install-plugin_yith-woocommerce-wishlist' );

        $btn_install_compare = '<a class="button button-primary" target="_blank" href="'.esc_url( $button_link_compare ).'">'.esc_html( $button_compare_text ).'</a>';
        $btn_install_quick_view = '<a class="button button-primary" target="_blank" href="'.esc_url( $button_link_quick_view ).'">'.esc_html( $button_quick_view_text ).'</a>';
        $btn_install_wishlist = '<a class="button button-primary" target="_blank" href="'.esc_url( $button_link_wishlist ).'">'.esc_html( $button_wishlist_text ).'</a>';

        if ( is_admin() ) {
            printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p> <p>%2$s %3$s %4$s</p></div>', $message, $btn_install_compare, $btn_install_quick_view, $btn_install_wishlist );
        }
        
    }

    public function init_widgets() {
        require_once( __DIR__ . '/widgets/widget-woo-product-grid.php' );
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type( new \TFWooProductGrid_Widget() );
        if ( class_exists( 'YITH_WCWL' ) ) {
            require_once( __DIR__ . '/widgets/widget-wishlist-count.php' );
            \Elementor\Plugin::instance()->widgets_manager->register_widget_type( new \TFWishlistCount_Widget() );
        }
        require_once( __DIR__ . '/widgets/widget-woo-product-single-image.php' );
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type( new \TFWooProductSingleImage_Widget() );
    }

    public function init_controls() {}    

    public function widget_styles() {
        if ( did_action( 'elementor/loaded' ) ) { 
        wp_register_style('font-awesome', ELEMENTOR_ASSETS_URL . 'lib/font-awesome/css/font-awesome.css', __FILE__);   
        wp_register_style('all-font-awesome', ELEMENTOR_ASSETS_URL . 'lib/font-awesome/css/all.min.css', __FILE__);

        }
        wp_register_style( 'owl-carousel', plugins_url( '/assets/css/owl.carousel.css', __FILE__ ) );
        wp_register_style( 'flexslider', plugins_url( '/assets/css/flexslider.css', __FILE__ ) );       
        wp_register_style( 'tf-woo-style', plugins_url( '/assets/css/tf-style.css', __FILE__ ) );        
    }

    public function widget_scripts() {
        wp_register_script( 'imagesloaded-pkgd', plugins_url( '/assets/js/imagesloaded.pkgd.min.js', __FILE__ ), [ 'jquery' ], false, true );
        wp_register_script( 'jquery-isotope', plugins_url( '/assets/js/jquery.isotope.min.js', __FILE__ ), [ 'jquery' ], false, true );
        wp_register_script( 'owl-carousel', plugins_url( '/assets/js/owl.carousel.min.js', __FILE__ ), [ 'jquery' ], false, true );
        wp_register_script( 'flexslider', plugins_url( '/assets/js/jquery.flexslider-min.js', __FILE__ ), [ 'jquery' ], false, true );
        wp_register_script( 'tf-woo-product-gird-main', plugins_url( '/assets/js/tf-main.js', __FILE__ ), [ 'jquery' ], false, true );
    }

    static function tf_get_template_elementor($type = null) {
        $args = [
            'post_type' => 'elementor_library',
            'posts_per_page' => -1,
        ];
        if ($type) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'elementor_library_type',
                    'field' => 'slug',
                    'terms' => $type,
                ],
            ];
        }
        $template = get_posts($args);
        $tpl = array();
        if (!empty($template) && !is_wp_error($template)) {
            foreach ($template as $post) {
                $tpl[$post->ID] = $post->post_title;
            }
        }
        return $tpl;
    }  

    static function tf_get_taxonomies_product( $category = 'product_cat' ){
        $category_posts = get_terms( array(
            'taxonomy' => $category,
            'hide_empty' => true,
        ));
        
        foreach ( $category_posts as $category_post ) {
            $category_posts_name[$category_post->slug] = $category_post->name;      
        }
        return $category_posts_name;
    }

}
TFWoo_Addon_Elementor::instance();