<?php
class TFWooProductSingleImage_Widget extends \Elementor\Widget_Base {

	public function get_name() {
        return 'tfwooproductsingleimage';
    }
    
    public function get_title() {
        return esc_html__( 'TF Woo Product Single Image', 'tf-addon-for-elementer' );
    }

    public function get_icon() {
        return 'eicon-image';
    }

    public function get_style_depends(){
	    return ['all-font-awesome', 'font-awesome', 'flexslider', 'tf-woo-style'];
  	}

    public function get_script_depends(){
	    return ['flexslider', 'tf-woo-product-gird-main'];
	}	
    
    public function get_categories() {
        return [ 'themesflat_addons_wc_single' ];
    }

	protected function _register_controls() {
        // Start Setting        
			$this->start_controls_section( 
				'section_product_image',
	            [
	                'label' => esc_html__('Product Settings', 'tf-addon-for-elementer'),
	            ]
	        );

	        $this->add_control( 
				'product_list_id',
				[
	                'label' => esc_html__( 'Product', 'tf-addon-for-elementer' ),
					'type' => \Elementor\Controls_Manager::SELECT,
					'options' => tf_get_all_id_product(),
				]
			);

	        $this->end_controls_section();
        // /.End Setting

	    // Start image Style        
			$this->start_controls_section( 
				'section_product_image_style',
	            [
	                'label' => esc_html__('Image', 'tf-addon-for-elementer'),
	                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
	            ]
	        );

	        $this->end_controls_section();
        // /.End image Style

	}

	protected function render($instance = []) {
		$settings = $this->get_settings_for_display();
		$product_list_id =  $settings['product_list_id'];

		$product_gallery = new WC_product($product_list_id);
		$gallery_ids = $product_gallery->get_gallery_image_ids();			
		    
        ?>   
		
        <div class="tf-woo-product-single-image">
			<?php if($gallery_ids): ?>
				<div class="single-image-slider">
				    <div id="image-flexslider">
				        <ul class="slides">
				            <?php 
								foreach( $gallery_ids as $gallery_id ) {
							        echo '<li><img src="' . wp_get_attachment_url( $gallery_id ) . '" class="image-gallery"></li>';
							    }
							?>
				        </ul>
				    </div>
				    <div id="image-carousel">
				        <ul class="slides">
				            <?php 
								foreach( $gallery_ids as $gallery_id ) {
							        echo '<li><img src="' . wp_get_attachment_url( $gallery_id ) . '" class="image-gallery"></li>';
							    }
							?>
				        </ul>
				    </div>
				</div><!-- /.single-image-slider -->
			<?php else: ?>
				<?php if ( has_post_thumbnail( $product_list_id ) ): 
					$image_ids[0] = get_post_thumbnail_id( $product_list_id );
		            $image_src = wp_get_attachment_image_src($image_ids[0], 'full' );
					?>
					<div class="single-image">   
			            <img src="<?php echo $image_src[0] ; ?>" class="image"  />        		
					</div><!-- /.single-image -->
				<?php endif; ?>	
			<?php endif; ?>
		</div>
		<?php
	}

	protected function _content_template() {}	

}