<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'britetest' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'zj/^% <H(/W>Nn0B#KM;K1=<Lcen:n#^/uc/-4fmaSu#[|fj=L`gf%[,oQw-};U8' );
define( 'SECURE_AUTH_KEY',  'psMsj[5,ttJ[AiFXwyY-p}~$I0#X|s]<^ u^VEQF0O[l:g]&.+JNC/y*$jrKSBd!' );
define( 'LOGGED_IN_KEY',    'nG;E;e%966-)XwxU?9v)c=Q_ucXN$# _@<y?ZMIqZ!E.Rn}Z[fq!YXrh{qxPhF/e' );
define( 'NONCE_KEY',        'yTF(|76;p<;!nUVzt*)AWs$Gr^WL/Z8,J0HH4a/DO?)?E8@9c!mA&c@A]uH(`br^' );
define( 'AUTH_SALT',        'p/{T4l|/PK6r8XaV;<S>k?-##6U];8HPP@XZu>g5`UehZ/mTO:qJU;~_{-}9##8o' );
define( 'SECURE_AUTH_SALT', '~Kw0dK%%F0Y^b%#9vS3zyL^2g.bE<t!<X=l/94UF8s:2*!9|dgL=)0e,{3kM06r.' );
define( 'LOGGED_IN_SALT',   'a*^;RrtdUr|q!ah<J<<hL89[tx tBu2^Mw]uWnkI3tRQb*h9MNW]*8LBuuPPB}0e' );
define( 'NONCE_SALT',       '!2HZ|=byN``B=fJw,JIDb7:9 Ql>C.pAb/y92SUB<m=_5%B.m<mZ>B:WU+5L)21)' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
