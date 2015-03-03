<?php

$plugin = array(
  'title' => t('Alumni: Reunion Finder | Alumni Reunion Finder'),
  'category' => t('Custom Content & Features'),
  'single' => TRUE,
  'all contexts' => TRUE,
);

/**
 * Implements hook_PLUGIN_content_type_render().
 */
function gsb_feature_alumni_reunion_group_page_display_reunion_finder_content_type_render($subtype, $conf, $panel_args, $context, $incoming) {
  // lookup all the group pages and the reunion aliases
  $query = db_select('node', 'n');
  $query->addExpression("TRIM(LEADING 'alumni/reunions/' FROM ua.alias)", 'alias');
  $query->addExpression("CONCAT_WS('', fap.field_alumni_program_value, DATE_FORMAT(fy.field_year_value, '%Y'))", 'program_year');
  $query->fields('n', array('status', 'type', 'nid'));
  $query->condition('n.status', '1', '=');
  $query->condition('n.type', 'alumni_reunion_group_page', '=');
  $query->leftjoin('field_data_field_year', 'fy', 'n.nid = fy.entity_id');
  $query->leftjoin('field_data_field_alumni_program', 'fap', 'n.nid = fap.entity_id');
  $query->leftjoin('url_alias', 'ua', "CONCAT('node/', n.nid) = ua.source");
  $result = $query->execute();
  // pass this aliases as settings in the js
  $settings = array ();
  foreach ($result as $record) {
    $settings[] = array(
      'program_year' => $record->program_year,
      'alias' => $record->alias,
      'nid' => $record->nid
    );
  }
  drupal_add_js( array ("alumni_reunion_group_page_alias" => $settings), 'setting');
  // Attach js for reunion finder
  $attached['js'] = array(
    array(
      'data' => drupal_get_path('module', 'gsb_feature_alumni_reunion_group_page_display') . '/js/reunion_finder.js',
      'options' => array(
        'scope' => 'footer',
      )
    )
  );
  // Attach css for reunion finder
  $attached['css'] = array(
    array(
      'data' => drupal_get_path('module', 'gsb_feature_alumni_reunion_group_page_display') . '/css/reunion_finder.css',
      'options' => array(
        'scope' => 'footer',
      )
    )
  );

  return (object) array(
    'title' => '',
    'content' => array(
      '#markup' => '' .
        '<div class="reunion-finder-image-wrapper"><img src="/' . drupal_get_path('module', 'gsb_feature_alumni_reunion_group_page_display') . '/images/bg-reunion-finder.jpg"></img></div>' .
        '<div class="reunion-finder-content-wrapper">' .
        '<h3>' . t('Find Your Reunion') . '</h3>' .
        '<div class="reunion-finder-form-wrapper">' .
        '<select id="programSelect" name="programSelect" title="Program Select" style="width:286px">' .
          '<option value="">' . t('Program') . '</option>' .
          '<option value="MBA">' . t('MBA') . '</option>' .
          '<option value="MSx">' . t('MSx') . '</option>' .
          '<option value="PhD">' . t('PhD') . '</option>' .
          '<option value="SEP">' . t('SEP') . '</option>' .
          '<option value="Sloan">' . t('Sloan') . '</option>' .
        '</select>' .
        '<label id="label_programYear" for="programYear">' . t('Enter Class Year') . '</label>' .
        '<input id="programYear" maxlength="4" name="programYear" size="4" type="text" placeholder="YYYY">' .
        '<p id="programYearError">' . t('Please enter your class year in YYYY') . '</p>' .
        '<p id="noReunionPage">' . t('Your Reunion Page has not been created') . '</p>' .
        '<a id="gotoReunion" href="">' . t('Go to Your Reunion Page') . '</a>' .
        '</div></div>' .
        '',
      '#attached' => $attached,
    ),
  );
}
