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
        '<h3>Find Your Reunion</h3>' .
        '<div class="reunion-finder-form-wrapper">' .
        '<select id="programSelect" name="programSelect" title="Program Select" style="width:286px">
          <option value="">Program</option>
          <option value="MBA">MBA</option>
          <option value="Sloan">Sloan</option>
          <option value="MSx">MSx</option>
        </select><br/><br/>' .
        '<label id="label_programYear" for="programYear">Enter Class Year</label>' .
        '<input id="programYear" maxlength="4" name="programYear" size="4" type="text" placeholder="YYYY">' .
        '<p id="programYearError">Please enter your class year in YYYY</p>' .
        '<br/><br/>' .
        '<p id="noReunionPage">Your Reunion Page has not been created</p>' .
        '<a id="gotoReunion" href="">' . t('Go to Your Reunion Page') . '</a>' .
        '</div></div>' .
        '',
      '#attached' => $attached,
    ),
  );
}
