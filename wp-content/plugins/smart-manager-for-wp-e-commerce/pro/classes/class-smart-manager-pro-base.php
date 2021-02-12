<?php

if ( !defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'Smart_Manager_Pro_Base' ) ) {
	class Smart_Manager_Pro_Base extends Smart_Manager_Base {

		public $dashboard_key = '';

		protected static $sm_beta_background_updater;
		protected static $sm_beta_background_updater_action;

		function __construct($dashboard_key) {
			$this->dashboard_key = $dashboard_key;
			parent::__construct($dashboard_key);
			self::$sm_beta_background_updater = Smart_Manager_Pro_Background_Updater::instance();

			add_filter( 'sm_dashboard_model', array( &$this, 'pro_dashboard_model' ), 11, 2 );
			add_filter( 'sm_data_model', array( &$this, 'pro_data_model' ), 11, 2);
			add_filter( 'sm_inline_update_pre', array( &$this, 'pro_inline_update_pre' ), 11, 1);
			add_filter( 'sm_default_dashboard_model_postmeta_cols', array( &$this, 'pro_custom_postmeta_cols' ), 11, 1 );

		}

		public function get_yoast_meta_robots_values() {
			return array( '-'            => __( 'Site-wide default', 'smart-manager-for-wp-e-commerce' ),
						'none'         => __( 'None', 'smart-manager-for-wp-e-commerce' ),
						'noimageindex' => __( 'No Image Index', 'smart-manager-for-wp-e-commerce' ),
						'noarchive'    => __( 'No Archive', 'smart-manager-for-wp-e-commerce' ),
						'nosnippet'    => __( 'No Snippet', 'smart-manager-for-wp-e-commerce' ) );
		}

		public function get_rankmath_robots_values() {
			return array( 'index'      => __( 'Index', 'smart-manager-for-wp-e-commerce' ),
						'noindex'      => __( 'No Index', 'smart-manager-for-wp-e-commerce' ),
						'nofollow'     => __( 'No Follow', 'smart-manager-for-wp-e-commerce' ),
						'noarchive'    => __( 'No Archive', 'smart-manager-for-wp-e-commerce' ),
						'noimageindex' => __( 'No Image Index', 'smart-manager-for-wp-e-commerce' ),
						'nosnippet'    => __( 'No Snippet', 'smart-manager-for-wp-e-commerce' ) );
		}

		public function get_rankmath_seo_score_class( $score ) {
			if ( $score > 80 ) {
				return 'great';
			}

			if ( $score > 51 && $score < 81 ) {
				return 'good';
			}

			return 'bad';
		}

		//Filter to add custom columns
		public function pro_custom_postmeta_cols( $postmeta_cols ) {

			$yoast_pm_cols = $rank_math_pm_cols = array();

			$active_plugins = (array) get_option( 'active_plugins', array() );

			if ( is_multisite() ) {
				$active_plugins = array_merge( $active_plugins, get_site_option( 'active_sitewide_plugins', array() ) );
			}

			if ( ( in_array( 'wordpress-seo/wp-seo.php', $active_plugins, true ) || array_key_exists( 'wordpress-seo/wp-seo.php', $active_plugins ) ) ) {
				$yoast_pm_cols = array('_yoast_wpseo_metakeywords','_yoast_wpseo_title','_yoast_wpseo_metadesc','_yoast_wpseo_meta-robots-noindex','_yoast_wpseo_primary_product_cat','_yoast_wpseo_focuskw_text_input','_yoast_wpseo_linkdex','_yoast_wpseo_focuskw','_yoast_wpseo_redirect','_yoast_wpseo_primary_category','_yoast_wpseo_content_score','_yoast_wpseo_meta-robots-nofollow','_yoast_wpseo_primary_kbe_taxonomy','_yoast_wpseo_opengraph-title','_yoast_wpseo_opengraph-description','_yoast_wpseo_primary_wpm-testimonial-category','_yoast_wpseo_twitter-title','_yoast_wpseo_twitter-description', '_yoast_wpseo_opengraph-image', '_yoast_wpseo_opengraph-image-id', '_yoast_wpseo_twitter-image', '_yoast_wpseo_twitter-image-id', '_yoast_wpseo_focuskeywords');
			}

			if( !empty( $yoast_pm_cols ) ) {
				foreach( $yoast_pm_cols as $meta_key ) {
					if( !isset( $postmeta_cols[ $meta_key ] ) ) {
						$postmeta_cols[ $meta_key ] = array( 'meta_key' => $meta_key, 'meta_value' => '' );
					}
				}	
			}

			if ( ( in_array( 'seo-by-rank-math/rank-math.php', $active_plugins, true ) || array_key_exists( 'seo-by-rank-math/rank-math.php', $active_plugins ) ) ) {
				$rank_math_pm_cols = array('rank_math_title','rank_math_description','rank_math_focus_keyword','rank_math_canonical_url','rank_math_facebook_title','rank_math_facebook_description','rank_math_twitter_title','rank_math_twitter_description','rank_math_breadcrumb_title', 'rank_math_robots', 'rank_math_seo_score', 'rank_math_facebook_image', 'rank_math_twitter_image_id', 'rank_math_twitter_image', 'rank_math_twitter_image_id', 'rank_math_primary_product_cat');
			}

			if( !empty( $rank_math_pm_cols ) ) {
				foreach( $rank_math_pm_cols as $meta_key ) {
					if( !isset( $postmeta_cols[ $meta_key ] ) ) {
						$postmeta_cols[ $meta_key ] = array( 'meta_key' => $meta_key, 'meta_value' => '' );
					}
				}	
			}

			return $postmeta_cols;
		}

		//Function to handle custom fields common in more than 1 post type
		public function pro_dashboard_model( $dashboard_model, $dashboard_model_saved ) {

			$colum_name_titles = array( 	'_yoast_wpseo_title' => __( 'Yoast SEO Title', 'smart-manager-for-wp-e-commerce' ), 
					 						'_yoast_wpseo_metadesc' => __( 'Yoast Meta Description', 'smart-manager-for-wp-e-commerce' ), 
					 						'_yoast_wpseo_metakeywords' => __( 'Yoast Meta Keywords', 'smart-manager-for-wp-e-commerce' ), 
					 						'_yoast_wpseo_focuskw' => __( 'Yoast Focus Keyphrase', 'smart-manager-for-wp-e-commerce' ), 
			 						);

			$html_columns = array( '_yoast_wpseo_content_score' => __( 'Yoast Readability Score', 'smart-manager-for-wp-e-commerce' ),
									'_yoast_wpseo_linkdex' => __( 'Yoast SEO Score', 'smart-manager-for-wp-e-commerce' ),
									'rank_math_seo_score' => __( 'Rank Math SEO Score', 'smart-manager-for-wp-e-commerce' ) );

			$product_cat_index = sm_multidimesional_array_search('terms_product_cat', 'data', $dashboard_model['columns']);

			$column_model = &$dashboard_model['columns'];

			foreach( $column_model as $key => &$column ) {
				if ( empty( $column['src'] ) ) continue;

				$src_exploded = explode("/",$column['src']);

				if (empty($src_exploded)) {
					$col_nm = $column['src'];
				}

				if ( sizeof($src_exploded) > 2 ) {
					$col_table = $src_exploded[0];
					$cond = explode("=",$src_exploded[1]);

					if (sizeof($cond) == 2) {
						$col_nm = $cond[1];
					}
				} else {
					$col_nm = $src_exploded[1];
					$col_table = $src_exploded[0];
				}

				switch( $col_nm ) {
					case '_yoast_wpseo_meta-robots-noindex':
						$column['key'] = $column['name'] = sprintf( __( 'Allow search engines to show this %1$s in search results?', 'smart-manager-for-wp-e-commerce' ), rtrim( $this->dashboard_title, 's' ) );
						$yoast_noindex = array( '0' => __( 'Default', 'smart-manager-for-wp-e-commerce'),
														'2' => __( 'Yes', 'smart-manager-for-wp-e-commerce' ),
														'1' => __( 'No', 'smart-manager-for-wp-e-commerce' ) );

						$column = $this->generate_dropdown_col_model( $column, $yoast_noindex );
						break;

					case '_yoast_wpseo_meta-robots-nofollow':
						$column['key'] = $column['name'] = sprintf( __( 'Should search engines follow links on this %1$s?', 'smart-manager-for-wp-e-commerce' ), rtrim( $this->dashboard_title, 's' ) );
						$yoast_nofollow = array('0' => __( 'Yes', 'smart-manager-for-wp-e-commerce' ),
												'1' => __( 'No', 'smart-manager-for-wp-e-commerce' ) );

						$column = $this->generate_dropdown_col_model( $column, $yoast_nofollow );
						break;
					case '_yoast_wpseo_meta-robots-adv':
						$column['key'] = $column['name'] = __( 'Meta robots advanced', 'smart-manager-for-wp-e-commerce' );
						$values = $this->get_yoast_meta_robots_values();
						$column = $this->generate_multilist_col_model( $column, $values );
						break;
					case 'rank_math_robots':
						$column['key'] = $column['name'] = __( 'Robots Meta', 'smart-manager-for-wp-e-commerce' );
						$values = $this->get_rankmath_robots_values();
						$column = $this->generate_multilist_col_model( $column, $values );
						break;
					case ($col_nm == '_yoast_wpseo_primary_product_cat' || $col_nm == 'rank_math_primary_product_cat'):

						$product_cat_values = array();

						$taxonomy_terms = get_terms('product_cat', array('hide_empty'=> 0,'orderby'=> 'id'));
						

						if( !empty( $taxonomy_terms ) ) {
							foreach ($taxonomy_terms as $term_obj) {
								$product_cat_values[$term_obj->term_id] = array();
								$product_cat_values[$term_obj->term_id]['term'] = $term_obj->name;
								$product_cat_values[$term_obj->term_id]['parent'] = $term_obj->parent;
							}
						}

						$values = $parent_cat_term_ids = array();
						foreach( $product_cat_values as $term_id => $obj ) {

							$values[ $term_id ] = $obj['term'];

							if( !empty( $obj['parent'] ) ) {
								$values[ $term_id ] = ( $product_cat_values[ $obj['parent'] ] ) ? $product_cat_values[ $obj['parent'] ]['term']. ' > ' .$values[ $term_id ] : $values[ $term_id ];
								if( in_array( $obj['parent'], $parent_cat_term_ids ) === false ) {
									$parent_cat_term_ids[] = $obj['parent'];
								}
							}
						}

						//Code for unsetting the parent category ids
						if( !empty( $parent_cat_term_ids ) ) {
							foreach( $parent_cat_term_ids as $parent_id ) {
								if( isset( $values[ $parent_id ] ) ) {
									unset( $values[ $parent_id ] );
								}
							}
						}

						$column = $this->generate_dropdown_col_model( $column, $values );
						break;
					case ( !empty( $colum_name_titles[ $col_nm ] ) ):
						$column['key'] = $column['name'] = $colum_name_titles[ $col_nm ];
						break;
					case ( !empty( $html_columns[ $col_nm ] ) ):
						$column['key'] = $column['name'] = $html_columns[ $col_nm ];
						$column['type'] = 'text';
						$column['renderer']= 'html';
						$column['frozen'] = false;
						$column['sortable'] = false;
						$column['exportable'] = true;
						$column['searchable'] = false;
						$column['editable'] = false;
						$column['editor'] = false;
						$column['batch_editable'] = false;
						$column['hidden'] = true;
						$column['allow_showhide'] = true;
						$column['width'] = 200;
						break;
				}
			}

			if (!empty($dashboard_model_saved)) {
				$col_model_diff = sm_array_recursive_diff($dashboard_model_saved,$dashboard_model);	
			}

			//clearing the transients before return
			if (!empty($col_model_diff)) {
				delete_transient( 'sa_sm_'.$this->dashboard_key );	
			}

			return $dashboard_model;
		}

		public function pro_data_model ($data_model, $data_col_params) {

			if( !class_exists('WPSEO_Rank') && file_exists( WP_PLUGIN_DIR. '/wordpress-seo/inc/class-wpseo-rank.php' ) ) {
				include_once WP_PLUGIN_DIR. '/wordpress-seo/inc/class-wpseo-rank.php';
			}

			if( empty( $data_model['items'] ) ) {
				return $data_model;
			}

			foreach ($data_model['items'] as $key => $data) {
				if (empty($data['posts_id'])) continue;

				//Code for handling data for Yoast Readability Score
				if( !empty( $data['postmeta_meta_key__yoast_wpseo_content_score_meta_value__yoast_wpseo_content_score'] ) && is_callable( array( 'WPSEO_Rank', 'from_numeric_score' ) ) ) {

					$rank  = WPSEO_Rank::from_numeric_score( (int)$data['postmeta_meta_key__yoast_wpseo_content_score_meta_value__yoast_wpseo_content_score'] );
					$title = $rank->get_label();
					$data_model['items'][$key]['postmeta_meta_key__yoast_wpseo_content_score_meta_value__yoast_wpseo_content_score'] = '<div aria-hidden="true" title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div><span class="screen-reader-text wpseo-score-text">' . $title . '</span>';
				}

				//Code for handling data for Yoast SEO Score
				if( !empty( $data['postmeta_meta_key__yoast_wpseo_linkdex_meta_value__yoast_wpseo_linkdex'] ) && is_callable( array( 'WPSEO_Rank', 'from_numeric_score' ) ) ) {

					$rank  = WPSEO_Rank::from_numeric_score( (int)$data['postmeta_meta_key__yoast_wpseo_linkdex_meta_value__yoast_wpseo_linkdex'] );
					$title = $rank->get_label();
					$data_model['items'][$key]['postmeta_meta_key__yoast_wpseo_linkdex_meta_value__yoast_wpseo_linkdex'] = '<div aria-hidden="true" title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div><span class="screen-reader-text wpseo-score-text">' . $title . '</span>';
				}

				//Code for handling Yoast Meta Robots
				if( isset( $data['postmeta_meta_key__yoast_wpseo_meta-robots-adv_meta_value__yoast_wpseo_meta-robots-adv'] ) ) {
					$actual_values = $this->get_yoast_meta_robots_values();
					if( !empty( $data['postmeta_meta_key__yoast_wpseo_meta-robots-adv_meta_value__yoast_wpseo_meta-robots-adv'] ) ) {

						$current_values = explode( ',', $data['postmeta_meta_key__yoast_wpseo_meta-robots-adv_meta_value__yoast_wpseo_meta-robots-adv'] );

						$formatted_value = array();

						foreach( $current_values as $value ) {

							if( !empty( $actual_values[ $value ] ) ) {
								$formatted_value[] = $actual_values[ $value ];
							}
						}

						$data_model['items'][$key]['postmeta_meta_key__yoast_wpseo_meta-robots-adv_meta_value__yoast_wpseo_meta-robots-adv'] = implode(', <br>', $formatted_value);
					} else {
						$data_model['items'][$key]['postmeta_meta_key__yoast_wpseo_meta-robots-adv_meta_value__yoast_wpseo_meta-robots-adv'] = $actual_values['-'];
					}	
				}

				//Code for handling Yoast Meta Robots
				if( isset( $data['postmeta_meta_key_rank_math_robots_meta_value_rank_math_robots'] ) ) {
					$actual_values = $this->get_rankmath_robots_values();
					if( !empty( $data['postmeta_meta_key_rank_math_robots_meta_value_rank_math_robots'] ) ) {

						$current_values = maybe_unserialize( $data['postmeta_meta_key_rank_math_robots_meta_value_rank_math_robots'] );

						$formatted_value = array();

						foreach( $current_values as $value ) {

							if( !empty( $actual_values[ $value ] ) ) {
								$formatted_value[] = $actual_values[ $value ];
							}
						}

						$data_model['items'][$key]['postmeta_meta_key_rank_math_robots_meta_value_rank_math_robots'] = implode(', <br>', $formatted_value);
					} else {
						$data_model['items'][$key]['postmeta_meta_key_rank_math_robots_meta_value_rank_math_robots'] = $actual_values['index'];
					}
				}

				//Code for handling data for Rank Math SEO Score
				if( isset( $data['postmeta_meta_key_rank_math_seo_score_meta_value_rank_math_seo_score'] ) ) {

					$score = ( !empty( $data['postmeta_meta_key_rank_math_seo_score_meta_value_rank_math_seo_score'] ) ) ? $data['postmeta_meta_key_rank_math_seo_score_meta_value_rank_math_seo_score'] : 0;
					$class     = $this->get_rankmath_seo_score_class( $score );
					$score = $score . ' / 100';

					$data_model['items'][$key]['postmeta_meta_key_rank_math_seo_score_meta_value_rank_math_seo_score'] = '<span class="rank-math-seo-score '.$class.'">
						<strong>'.$score.'</strong></span>';
				}


				

			}

			return $data_model;
		}

		public function pro_inline_update_pre( $edited_data ) {
			if (empty($edited_data)) return $edited_data;

			foreach ($edited_data as $id => $edited_row) {

				if( empty( $id ) ) {
					continue;
				}

				//Code for handling Yoast SEO meta robots editing
				if( !empty( $edited_row['postmeta/meta_key=_yoast_wpseo_meta-robots-adv/meta_value=_yoast_wpseo_meta-robots-adv'] ) ) {
					$actual_values = $this->get_yoast_meta_robots_values();
					$current_values = explode( ', <br>', $edited_row['postmeta/meta_key=_yoast_wpseo_meta-robots-adv/meta_value=_yoast_wpseo_meta-robots-adv'] );

					$formatted_value = array();

					foreach( $current_values as $value ) {

						$key = array_search( $value, $actual_values );

						if( $key !== false ) {
							$formatted_value[] = $key;
						}
					}

					$edited_data[$id]['postmeta/meta_key=_yoast_wpseo_meta-robots-adv/meta_value=_yoast_wpseo_meta-robots-adv'] = implode(',', $formatted_value);
				}

				// Code for handling Rank Math robots editing
				if( !empty( $edited_row['postmeta/meta_key=rank_math_robots/meta_value=rank_math_robots'] ) ) {
					$actual_values = $this->get_yoast_meta_robots_values();
					$current_values = explode( ', <br>', $edited_row['postmeta/meta_key=rank_math_robots/meta_value=rank_math_robots'] );
					$formatted_value = array();

					foreach( $current_values as $value ) {

						$key = array_search( $value, $actual_values );

						if( $key !== false ) {
							$formatted_value[] = $key;
						}
					}

					$edited_data[$id]['postmeta/meta_key=rank_math_robots/meta_value=rank_math_robots'] = $formatted_value;
				}

			}

			return $edited_data;
		}

		public function generate_multilist_col_model( $colObj, $values = array() ) {
			
			$colObj ['values'] = array();

			foreach( $values as $key => $value ) {
				$colObj ['values'][$key] = array( 'term' => $value, 'parent' => 0 );
			}

			//code for handling values for advanced search
			$colObj['search_values'] = array();
			foreach( $values as $key => $value ) {
				$colObj['search_values'][] = array( 'key' => $key, 'value' => $value );
			}

			$colObj ['type'] = $colObj ['editor'] = 'sm.multilist';
			$colObj ['strict'] 			= true;
			$colObj ['allowInvalid'] 	= false;
			$colObj ['editable']		= false;

			return $colObj;
		}

		public function generate_dropdown_col_model( $colObj, $dropdownValues = array() ) {

			$dropdownKeys = ( !empty( $dropdownValues ) ) ? array_keys( $dropdownValues ) : array();
			$colObj['defaultValue'] = ( !empty( $dropdownKeys[0] ) ) ? $dropdownKeys[0] : '';
			$colObj['save_state'] = true;
			
			$colObj['values'] = $dropdownValues;
			$colObj['selectOptions'] = $dropdownValues; //for inline editing

			$colObj['search_values'] = array();
			foreach( $dropdownValues as $key => $value) {
				$colObj['search_values'][] = array('key' => $key, 'value' => $value);
			}

			$colObj['type'] = 'dropdown';
			$colObj['strict'] = true;
			$colObj['allowInvalid'] = false;
			$colObj['editor'] = 'select';
			$colObj['renderer'] = 'selectValueRenderer';

			return $colObj;
		}

		public function get_entire_store_ids() {

			global $wpdb;

			$selected_ids = array();

			if( !empty( $this->req_params['filteredResults'] ) ) {
				$post_ids = get_transient('sm_beta_search_post_ids');
				$selected_ids = ( !empty( $post_ids ) ) ? explode( ",", $post_ids ) : array();
			} else {

				$post_type = (!empty($this->req_params['table_model']['posts']['where'])) ? $this->req_params['table_model']['posts']['where'] : array('post_type' => $this->dashboard_key);

				if( !empty( $this->req_params['table_model']['posts']['where']['post_type'] ) ) {
            		$post_type = ( is_array( $this->req_params['table_model']['posts']['where']['post_type'] ) ) ? $this->req_params['table_model']['posts']['where']['post_type'] : array( $this->req_params['table_model']['posts']['where']['post_type'] );
            	}

				$from = " FROM {$wpdb->prefix}posts ";
				$where = " WHERE post_type IN ('". implode( "','", $post_type ) ."') ";

				$from	= apply_filters('sm_beta_background_entire_store_ids_from', $from, $this->req_params);
				$where	= apply_filters('sm_beta_background_entire_store_ids_where', $where, $this->req_params);
				
				$query = apply_filters( 'sm_beta_background_entire_store_ids_query', $wpdb->prepare( "SELECT ID ". $from ." ". $where ." AND 1=%d", 1 ) );
				$selected_ids = $wpdb->get_col( $query );
			}

			return $selected_ids;
		}

		//function to handle batch update request
		public function batch_update() {
			global $wpdb, $current_user;

			$current_store_model = get_transient( 'sa_sm_'.$this->dashboard_key );
			$col_model = (!empty($current_store_model['columns'])) ? $current_store_model['columns'] : array();

			$data_cols_timestamp = array();

			//Code for storing the timestamp cols
			foreach( $col_model as $col ) {
				$col_exploded = (!empty($col['src'])) ? explode("/", $col['src']) : array();

				if (empty($col_exploded)) continue;
				
				if ( sizeof($col_exploded) > 2) {
					$col_meta = explode("=",$col_exploded[1]);
					$col_nm = $col_meta[1];
				} else {
					$col_nm = $col_exploded[1];
				}

				if ( !empty( $col['type'] ) ) {
					if( ($col['type'] == 'sm.datetime' || $col['type'] == 'sm.date' || $col['type'] == 'sm.time') && !empty( $col['date_type'] ) && $col['date_type'] == 'timestamp' ) {
						$data_cols_timestamp[] = $col_nm;
					}
				}
			}

			$batch_update_actions = (!empty($this->req_params['batch_update_actions'])) ? json_decode(stripslashes($this->req_params['batch_update_actions']), true) : array();

			$dashboard_key = $this->dashboard_key; //fix for PHP 5.3 or earlier

			$batch_update_actions = array_map( function( $batch_update_action ) use ($dashboard_key, $data_cols_timestamp) {
				$batch_update_action['dashboard_key'] = $dashboard_key;

				if( !empty( $data_cols_timestamp ) ) {
					if( in_array( $batch_update_action['col_nm'], $data_cols_timestamp ) ){
						$batch_update_action['date_type'] = 'timestamp';
					}
				}

				return $batch_update_action;
			}, $batch_update_actions);

			$this->send_to_background_process( array( 'process_name' => 'Bulk Edit', 
														'callback' => array( 'class_path' => $this->req_params['class_path'], 
																			'func' => array( $this->req_params['class_nm'], 'process_batch_update' ) ),
														'actions' => $batch_update_actions ) );
		}

		//function to handle batch update request
		public function send_to_background_process( $params = array() ) {

			$selected_ids = (!empty($this->req_params['selected_ids'])) ? json_decode(stripslashes($this->req_params['selected_ids']), true) : array();
			
			$entire_store = false;

			if( !empty( $this->req_params['storewide_option']) && $this->req_params['storewide_option'] == 'entire_store' && !empty($this->req_params['active_module']) ) { //code for fetching all the ids in case of any background process
				$selected_ids = $this->get_entire_store_ids();
				$entire_store = true;
			}

			$identifier = '';

			if ( is_callable( array( 'Smart_Manager_Pro_Background_Updater', 'get_identifier' ) ) ) {
				$identifier = Smart_Manager_Pro_Background_Updater::get_identifier();
			}

			if( !empty( $identifier ) && ! empty( $selected_ids ) ) {

				$default_params = array( 'process_name' => 'Batch Update', 
										'callback' => array( 'class_path' => $this->req_params['class_path'], 
															'func' => array( $this->req_params['class_nm'], 'process_batch_update' ) ),
										'id_count' => count($selected_ids),
										'active_dashboard' => $this->dashboard_title,
										'backgroundProcessRunningMessage' => $this->req_params['backgroundProcessRunningMessage'],
										'entire_store' => $entire_store, 
										'dashboard_key' => $this->dashboard_key,
										'SM_IS_WOO30' => $this->req_params['SM_IS_WOO30'] );


				$params = ( !empty( $params ) ) ? array_merge( $default_params, $params ) : $default_params;

				update_option( $identifier.'_params', $params);
				update_option( $identifier.'_ids', $selected_ids);
				update_option( $identifier.'_initial_process', 1 );

				//Calling the initiate_batch_process function to initiaite the batch process
				if ( is_callable( array( self::$sm_beta_background_updater, 'initiate_batch_process' ) ) ) {
					self::$sm_beta_background_updater->initiate_batch_process();
				}
			}
		}

		//function to process batch update conditions
		public static function process_batch_update($args) {
			do_action('sm_beta_pre_process_batch');

			// code for processing logic for batch update
			if( empty($args['table_nm']) || empty($args['action']) || empty($args['col_nm']) || empty($args['id']) ) {
				return false;
			}


			$prev_val = $new_val = '';

			if( $args['action'] != 'set_to' ) { //code to fetch prev stored values
				if( $args['table_nm'] == 'posts' ) {
					$prev_val = get_post_field($args['col_nm'], $args['id']);
				} else if( $args['table_nm'] == 'postmeta' ) {
					$prev_val = get_post_meta($args['id'], $args['col_nm'], true);
				}

				$prev_val = apply_filters( 'sm_beta_batch_update_prev_value', $prev_val, $args );
			}

			if( $args['type'] == 'numeric' ) {
				$prev_val = ( ! empty( $prev_val ) ) ? floatval( $prev_val ) : 0;;
			}

			$args['prev_val'] = $prev_val;

			$value1 = ( ( is_array( $args['value'] ) && isset( $args['value'][0]) ) ? $args['value'][0] : $args['value'] );
			$value2 = ( ( is_array( $args['value'] ) && isset( $args['value'][1]) ) ? $args['value'][1] : '' );

			if( $args['type'] == 'numeric' ) {
				$value1 = ( ! empty( $value1 ) ) ? floatval( $value1 ) : 0;
			}

			//Code for handling different conditions for updating datetime fields
			if( $args['type'] == 'sm.datetime' && ( $args['action'] == 'set_date_to' || $args['action'] == 'set_time_to' ) ) {
				//if prev_val is null
				if( empty($prev_val) ) {
					$date = ( $args['action'] == 'set_date_to' ) ? $value1 : current_time( 'Y-m-d' );
					$time = ( $args['action'] == 'set_time_to' ) ? $value1 : current_time( 'H:i:s' );
				} else {
					$date = ( $args['action'] == 'set_date_to' ) ? $value1 : date('Y-m-d', strtotime($prev_val));
					$time = ( $args['action'] == 'set_time_to' ) ? $value1 : date('H:i:s', strtotime($prev_val));
				}

				$value1 = $date.' '.$time;
			}

			if( ( $args['type'] == 'sm.datetime' || $args['type'] == 'sm.date' || $args['type'] == 'sm.time' ) && !empty( $args['date_type'] ) && $args['date_type'] == 'timestamp' ) { //code for handling timestamp values

				if( $args['type'] == 'sm.time' ) {
					$value1 = '1970-01-01 '.$value1;
				}

				$value1 = strtotime( $value1 );
			}

			if( $args['type'] == 'dropdown' ) {
				if( $args['action'] == 'add_to' || $args['action'] == 'remove_from' ) {

					if( !empty( $args['multiSelectSeparator'] ) && !empty( $prev_val ) ) {
						$prev_val = explode( $args['multiSelectSeparator'], $prev_val );
					} else {
						$prev_val = ( !empty( $prev_val ) ) ? $prev_val : array();	
					}

					$value1 = ( !is_array( $value1 ) ) ? array( $value1 ) : $value1;

					if( !empty( $prev_val ) ) {
						$value1 = ( $args['action'] == 'add_to' ) ? array_merge($prev_val, $value1) : array_diff($prev_val, $value1);
					}

					$value1 = array_unique( $value1 );
				} 
				
				$separator = ( !empty( $args['multiSelectSeparator'] ) ) ? $args['multiSelectSeparator'] : ",";
				$value1 = ( !empty( $separator ) && is_array( $value1 ) ) ? implode( $separator, $value1 ) : $value1;
			}

			if( $args['type'] == 'sm.multilist' && $args['action'] != 'set_to' && $args['table_nm'] == 'postmeta' ) { //code for handling multilist values
				
			}

			//cases to update the value based on the batch update actions
			switch( $args['action'] ) {
				case 'set_to':
					$new_val = $value1;
					break;
				case 'prepend':
					$new_val = $value1.''.$prev_val;
					break;
				case 'append':
					$new_val = $prev_val.''.$value1;
					break;
				case 'search_and_replace':
					$new_val = str_replace( $value1, $value2, $prev_val );
					break;
				case 'increase_by_per':
					$new_val = round( ($prev_val + ($prev_val * ($value1 / 100))), apply_filters('sm_beta_pro_num_decimals',get_option( 'woocommerce_price_num_decimals' )) );
					break;
				case 'decrease_by_per':
					$new_val = round( ($prev_val - ($prev_val * ($value1 / 100))), apply_filters('sm_beta_pro_num_decimals',get_option( 'woocommerce_price_num_decimals' )) );
					break;
				case 'increase_by_num':
					$new_val = round( ($prev_val + $value1), apply_filters('sm_beta_pro_num_decimals',get_option( 'woocommerce_price_num_decimals' )) );
					break;
				case 'decrease_by_num':
					$new_val = round( ($prev_val - $value1), apply_filters('sm_beta_pro_num_decimals',get_option( 'woocommerce_price_num_decimals' )) );
					break;
				default:
					$new_val = $value1;
					break;
			}

			//Code for handling 'copy_from' action
			if( $args['action'] == 'copy_from' && !empty( $value1 ) ) {
				if( $args['table_nm'] == 'posts' ) {
					$new_val = get_post_field( $args['col_nm'], $value1 );
				} else if( $args['table_nm'] == 'postmeta' ) {
					$new_val = get_post_meta( $value1, $args['col_nm'], true );
				} else if( $args['table_nm'] == 'terms' ) {
					$term_ids = wp_get_object_terms( $value1, $args['col_nm'], array('orderby' => 'term_id', 'order' => 'ASC', 'fields' => 'ids') );

					if( !is_wp_error( $term_ids ) && !empty( $term_ids ) ) {
						$new_val = ( !empty( $term_ids ) ) ? $term_ids : array();
					}
				}

				$new_val = ( $args['type'] == 'numeric' && empty( $new_val ) ) ? 0 : $new_val;
			}

			$args['value'] = $new_val;
			$args = apply_filters('sm_beta_post_batch_process_args', $args);
			self::process_batch_update_db_updates($args);
		}

		//function to handle the batch update db updates
		public static function process_batch_update_db_updates($args) {

			do_action('sm_pre_batch_update_db_updates',$args);

			set_transient('sm_beta_skip_delete_dashboard_transients', 1, DAY_IN_SECONDS); // for preventing delete dashboard transients

			$update = false;
			$default_batch_update = true;

			$default_batch_update = apply_filters( 'sm_default_batch_update_db_updates',$default_batch_update );

			if( $default_batch_update ) {			

				if( $args['table_nm'] == 'posts' ) {
					$update = wp_update_post(array('ID' => $args['id'], $args['col_nm'] => $args['value']));
				} else if( $args['table_nm'] == 'postmeta' ) {
					$update = update_post_meta($args['id'], $args['col_nm'], $args['value']);
				} else if( $args['table_nm'] == 'terms' ) {

					if( $args['action'] == 'copy_from' ) {
						$value = $args['value'];
					} else {
						$value = ( is_array($args['value']) && !empty( $args['value'][0] ) ) ? intval( $args['value'][0] ) : intval( $args['value'] );
					}
 
					if( $args['action'] == 'remove_from' ) {
						$update = wp_remove_object_terms( $args['id'], $value, $args['col_nm'] );
					} else {
						$append = ( $args['action'] == 'add_to' ) ? true : false;
						$update = wp_set_object_terms( $args['id'], $value, $args['col_nm'], $append );
					}
				}
			}

			$update = apply_filters('sm_post_batch_update_db_updates',$update ,$args);

			if( is_wp_error($update) ) {
				return false;
			} else {
				return true;
			}
		}

		//function to handle batch process complete
		public static function batch_process_complete() {

			$identifier = '';

			if ( is_callable( array( 'Smart_Manager_Pro_Background_Updater', 'get_identifier' ) ) ) {
				$identifier = Smart_Manager_Pro_Background_Updater::get_identifier();
			}

			if( empty( $identifier ) ) {
				return;
			}

			$background_process_params = get_option( $identifier.'_params', false );

			if( empty( $background_process_params ) ) {
				return;
			}

			delete_option( $identifier.'_params' );

			// Preparing email content
			$email = get_option('admin_email');
			$site_title = get_option( 'blogname' );

			$email_heading_color = get_option('woocommerce_email_base_color');
			$email_heading_color = (empty($email_heading_color)) ? '#96588a' : $email_heading_color; 
			$email_text_color = get_option('woocommerce_email_text_color');
			$email_text_color = (empty($email_text_color)) ? '#3c3c3c' : $email_text_color; 

			$actions = ( !empty($background_process_params['actions']) ) ? $background_process_params['actions'] : array();

			$records_str = $background_process_params['id_count'] .' '. (( $background_process_params['id_count'] > 1 ) ? __( 'records', SM_TEXT_DOMAIN ) : __( 'record', SM_TEXT_DOMAIN ));
			$records_str .= ( $background_process_params['entire_store'] ) ? ' ('. __( 'entire store', SM_TEXT_DOMAIN ) .')' : '';

			$background_process_param_name = $background_process_params['process_name'];

			$title = sprintf( __( '[%1s] %2s process completed!', SM_TEXT_DOMAIN ), $site_title, $background_process_param_name );

			ob_start();

			include( apply_filters( 'sm_beta_pro_batch_email_template', SM_PRO_URL.'templates/email.php' ) );

			$message = ob_get_clean();

			$subject = $title;

			if( function_exists( 'wc_mail' ) ) {
				wc_mail( $email, $subject, $message );
			} else {
				wp_mail( $email, $subject, $message );
			}

		}

		// Function to generate and export the CSV data
		public function get_export_csv() {

			global $current_user;

			ini_set('memory_limit','-1');
			set_time_limit(0);

			$this->req_params['sort_params'] = json_decode( stripslashes( $this->req_params['sort_params'] ), true );
			$this->req_params['table_model'] = json_decode( stripslashes( $this->req_params['table_model'] ), true );

			$current_store_model = get_transient( 'sa_sm_'.$this->dashboard_key );
			$column_model_transient = get_user_meta(get_current_user_id(), 'sa_sm_'.$this->dashboard_key, true);

			// Code for handling views
			if( ( defined('SMPRO') && true === SMPRO ) && ! empty( $this->req_params['is_view'] ) && ! empty( $this->req_params['active_view'] ) ) {
				if( class_exists( 'Smart_Manager_Pro_Views' ) ) {
					$view_obj = Smart_Manager_Pro_Views::get_instance();
					if( is_callable( array( $view_obj, 'get' ) ) ){
						$view_slug = $this->req_params['active_view'];
						$view_data = $view_obj->get($view_slug);
						if( ! empty( $view_data ) ) {
							$this->dashboard_key = $view_data['post_type'];
							$column_model_transient = get_user_meta(get_current_user_id(), 'sa_sm_'.$view_slug, true);
							$column_model_transient = json_decode( $view_data['params'], true );
							if( !empty( $column_model_transient['search_params'] ) ) {
								if( ! empty( $column_model_transient['search_params']['isAdvanceSearch'] ) ) { // For advanced search
									if( ! empty( $column_model_transient['search_params']['params'] ) && is_array( $column_model_transient['search_params']['params'] ) ) {
										array_walk(
											$column_model_transient['search_params']['params'],
											function ( &$value ) {
												$value = ( ! empty( $value ) ) ? ( json_encode( $value ) ) : '';
											}
										);
									}
								}
								$search_params = $column_model_transient['search_params'];
							}
						}
					}
				}
			}

			if( !empty( $column_model_transient ) && !empty( $current_store_model ) ) {
				$current_store_model = $this->map_column_to_store_model( $current_store_model, $column_model_transient );
			}

			$col_model = (!empty($current_store_model['columns'])) ? $current_store_model['columns'] : array();

			$data = $this->get_data_model();

			$columns_header = $select_cols = array();

			$getfield = '';

			foreach( $col_model as $col ) {

				if( empty( $col['exportable'] ) || !empty( $col['hidden'] ) ) {
					continue;
				}

				$columns_header[ $col['data'] ] = $col['key'];

				$getfield .= $col['key'] . ',';

				if( !empty( $col['values'] ) ) {
					$select_cols[ $col['data'] ] = $col['values'];
				}
			}

			$fields = substr_replace($getfield, '', -1);
			$each_field = array_keys( $columns_header );

			$view_name = ( ! empty( $this->req_params['active_view'] ) ) ? $this->req_params['active_view'] . '-view_' : '';
			$csv_file_name = sanitize_title(get_bloginfo( 'name' )) . '_' . $this->dashboard_key . '_' . $view_name . gmdate('d-M-Y_H:i:s') . ".csv";

			foreach( (array) $data['items'] as $row ){

				for($i = 0; $i < count ( $columns_header ); $i++){

					if( $i == 0 ){
						$fields .= "\n";	
					}

					if( !empty( $select_cols[ $each_field[$i] ] ) ) {
						$row_each_field = !empty( $select_cols[ $each_field[$i] ][ $row[$each_field[$i]] ] ) ? $select_cols[ $each_field[$i] ][ $row[$each_field[$i]] ] : $row[$each_field[$i]];
					} else {
						$row_each_field = !empty($row[$each_field[$i]]) ? $row[$each_field[$i]] : '';
					}
					$array_temp = str_replace(array("\n", "\n\r", "\r\n", "\r"), "\t", $row_each_field);
					
					$array = str_replace("<br>", "\n", $array_temp);
					$array = str_replace('"', '""', $array);
					$array = str_getcsv ( $array , ",", "\"" , "\\");
					$str = ( $array && is_array( $array ) ) ? implode( ', ', $array ) : '';
					$fields .= '"'. $str . '",'; 

				}	
				$fields = substr_replace($fields, '', -1); 
			}

			$upload_dir = wp_upload_dir();
			$file_data = array();
			$file_data['wp_upload_dir'] = $upload_dir['path'] . '/';
			$file_data['file_name'] = $csv_file_name;
			$file_data['file_content'] = $fields;

			header("Content-type: text/x-csv; charset=UTF-8"); 
			header("Content-Transfer-Encoding: binary");
			header("Content-Disposition: attachment; filename=".$file_data['file_name']); 
			header("Pragma: no-cache");
			header("Expires: 0");

			while(ob_get_contents()) {
				ob_clean();
			}

			echo $file_data['file_content'];
			
			exit;
		}

		//Function to generate the data for print_invoice
		public function get_print_invoice() {

			global $smart_manager_beta;

			ini_set('memory_limit','512M');
			set_time_limit(0);

			$purchase_id_arr = json_decode( stripslashes( $this->req_params['selected_ids'] ), true );
			$sm_text_domain = 'smart-manager-for-wp-e-commerce';
			$sm_is_woo30 = ( ! empty( Smart_Manager::$sm_is_woo30 ) && 'true' === Smart_Manager::$sm_is_woo30 ) ? true : false;

			ob_start();
			include( apply_filters( 'sm_beta_pro_batch_order_invoice_template', SM_PRO_URL.'templates/order-invoice.php' ) );
			echo ob_get_clean();
			exit;
		}

		//function to handle duplicate records functionality
		public function duplicate_records() {
			$this->send_to_background_process( array( 'process_name' => 'Duplicate Records', 
														'callback' => array( 'class_path' => $this->req_params['class_path'], 
																			'func' => array( $this->req_params['class_nm'], 'process_duplicate_record' ) ) 
													)
											);
		}

		public static function get_duplicate_record_settings() {
	
			$defaults = array(
				'status' => 'same',
				'type' => 'same',
				'timestamp' => 'current',
				'title' => '('.__('Copy', SM_TEXT_DOMAIN).')',
				'slug' => 'copy',
				'time_offset' => false,
				'time_offset_days' => 0,
				'time_offset_hours' => 0,
				'time_offset_minutes' => 0,
				'time_offset_seconds' => 0,
				'time_offset_direction' => 'newer'
			);
			
			$settings = apply_filters( 'sm_beta_duplicate_records_settings', $defaults );
			
			return $settings;
		}


		//function to process duplicate records logic
		public static function process_duplicate_record( $params ) {

			$original_id = ( !empty( $params['id'] ) ) ? $params['id'] : '';

			do_action('sm_beta_pre_process_duplicate_records', $original_id );

			//code for processing logic for duplicate records
			if( empty( $original_id ) ) {
				return false;
			}

			global $wpdb;

			// Get the post as an array
			$duplicate = get_post( $original_id, 'ARRAY_A' );
				
			$settings = self::get_duplicate_record_settings();
			
			// Modify title
			$appended = ( $settings['title'] != '' ) ? ' '.$settings['title'] : '';
			$duplicate['post_title'] = $duplicate['post_title'].' '.$appended;
			$duplicate['post_name'] = sanitize_title($duplicate['post_name'].'-'.$settings['slug']);
			
			// Set the post status
			if( $settings['status'] != 'same' ) {
				$duplicate['post_status'] = $settings['status'];
			}
			
			// Set the post type
			if( $settings['type'] != 'same' ) {
				$duplicate['post_type'] = $settings['type'];
			}
			
			// Set the post date
			$timestamp = ( $settings['timestamp'] == 'duplicate' ) ? strtotime($duplicate['post_date']) : current_time('timestamp',0);
			$timestamp_gmt = ( $settings['timestamp'] == 'duplicate' ) ? strtotime($duplicate['post_date_gmt']) : current_time('timestamp',1);
			
			if( $settings['time_offset'] ) {
				$offset = intval($settings['time_offset_seconds']+$settings['time_offset_minutes']*60+$settings['time_offset_hours']*3600+$settings['time_offset_days']*86400);
				if( $settings['time_offset_direction'] == 'newer' ) {
					$timestamp = intval($timestamp+$offset);
					$timestamp_gmt = intval($timestamp_gmt+$offset);
				} else {
					$timestamp = intval($timestamp-$offset);
					$timestamp_gmt = intval($timestamp_gmt-$offset);
				}
			}
			$duplicate['post_date'] = date('Y-m-d H:i:s', $timestamp);
			$duplicate['post_date_gmt'] = date('Y-m-d H:i:s', $timestamp_gmt);
			$duplicate['post_modified'] = date('Y-m-d H:i:s', current_time('timestamp',0));
			$duplicate['post_modified_gmt'] = date('Y-m-d H:i:s', current_time('timestamp',1));

			// Remove some of the keys
			unset( $duplicate['ID'] );
			unset( $duplicate['guid'] );
			unset( $duplicate['comment_count'] );

			// Insert the post into the database
			$duplicate_id = wp_insert_post( $duplicate );
			
			// Duplicate all the taxonomies/terms
			$taxonomies = get_object_taxonomies( $duplicate['post_type'] );
			foreach( $taxonomies as $taxonomy ) {
				$terms = wp_get_post_terms( $original_id, $taxonomy, array('fields' => 'names') );
				wp_set_object_terms( $duplicate_id, $terms, $taxonomy );
			}
		  
			// Duplicate all the custom fields
			$custom_fields = get_post_custom( $original_id );

			$postmeta_data = array();

			foreach ( $custom_fields as $key => $value ) {
			  if( is_array($value) && count($value) > 0 ) { //TODO: optimize
					foreach( $value as $i=>$v ) {
						$postmeta_data[] = '('.$duplicate_id.',\''.$key.'\',\''.$v.'\')'; 
					}
				}
			}

			if( !empty($postmeta_data) ) {

				$q = "INSERT INTO {$wpdb->prefix}postmeta(post_id, meta_key, meta_value) VALUES ". implode(",", $postmeta_data);
				$query = $wpdb->query("INSERT INTO {$wpdb->prefix}postmeta(post_id, meta_key, meta_value) VALUES ". implode(",", $postmeta_data));
			}

			do_action( 'sm_beta_post_process_duplicate_records', array( 'original_id' => $original_id, 'duplicate_id' => $duplicate_id, 'settings' => $settings, 'duplicate' => $duplicate ) );
			
			if( is_wp_error($duplicate_id) ) {
				return false;
			} else {
				return true;
			}

		}

		/**
		 * Function to handle deletion via background process
		 */
		public function delete_all() {
			$this->send_to_background_process( array( 'process_name' => 'Delete All Records', 
														'callback' => array( 'class_path' => $this->req_params['class_path'], 
																			'func' => array( $this->req_params['class_nm'], 'process_delete_record' ) ),
														'callback_params' => array ( 'delete_permanently' => $this->req_params['deletePermanently'] )
													) 
											);
		}

		/**
		 * Function to handle delete of a single record
		 *
		 * @param  integer $deleting_id The ID of the record to be deleted.
		 * @return boolean
		 */
		public static function process_delete_record( $params ) {

			$deleting_id = ( !empty( $params['id'] ) ) ? $params['id'] : '';

			do_action('sm_beta_pre_process_delete_records', array( 'deleting_id' => $deleting_id, 'source' => __CLASS__ ) );

			//code for processing logic for duplicate records
			if( empty( $deleting_id ) ) {
				return false;
			}

			$force_delete = ( !empty($params['delete_permanently']) ) ? true : false;
			$result = ( $force_delete ) ? wp_delete_post( $deleting_id, $force_delete ) : wp_trash_post( $deleting_id );
			do_action( 'sm_beta_post_process_delete_records', array( 'deleting_id' => $deleting_id, 'source' => __CLASS__ ) );
			
			if( empty( $result ) ) {
				return false;
			} else {
				return true;
			}

		}

	}
}
