<?php


namespace helpers;


class required
{
    // addresses
    protected $address_js_lib = "/assets/client/theme/js/lib";
    protected $address_js = "/assets/client/theme/js";
    protected $address_css_lib = "/assets/client/theme/css/lib";
    protected $address_css = "/assets/client/theme/css";
    protected $address_font = "/assets/client/theme/font";

    // js files
    protected $js_lib_jquery = "jquery-3.4.1.min.js";
    protected $js_lib_vue = "vue_2.6.11.js";
    protected $js_lib_bootstrap = "bootstrap.min.js";
    protected $js_lib_sweetalert2 = "sweetalert2@9.js";

    protected $js_functions = "functions.js";
    protected $js_VueHelpers = "VueHelpers.js";

    protected $js_vueUInstant = "vueInstant.js";
    protected $js_component_index = "component/index.js";
    protected $js_component_addCommand = "component/addCommand.js";
    protected $js_component_general = "component/general.js";

    // css files
    protected $css_styles = "styles.css";
    protected $css_lib_bootstrap = "bootstrap.css";

    private function cssAdder($fileName,$lib = false){
        $baseAddress = $lib ? $this->address_css_lib : $this->address_css;
        return "<link rel='stylesheet' href='{$baseAddress}/$fileName'>";
    }

    private function jsAdder($fileName,$lib = false){
        $baseAddress = $lib ? $this->address_js_lib : $this->address_js;
        return "<script src='{$baseAddress}/$fileName'></script>";
    }

    public function requiredFiles () {
        $meta = "<meta name='viewport content='width=device-width, initial-scale=1.0'>";

        $jsLibFileList = [
            $this->js_lib_jquery,
            $this->js_lib_vue,
            $this->js_lib_bootstrap,
            $this->js_lib_sweetalert2,
        ];
        $jsFileList = [
            $this->js_functions,
            $this->js_component_general,
            $this->js_VueHelpers,
        ];
        $cssLibFileList = [
            $this->css_lib_bootstrap,
        ];
        $cssFileList = [
            $this->css_styles,
        ];

        foreach ($jsLibFileList as $file){
            $meta .= $this->jsAdder($file,true);
        }
        foreach ($jsFileList as $file){
            $meta .= $this->jsAdder($file,false);
        }
        foreach ($cssLibFileList as $file){
            $meta .= $this->cssAdder($file,true);
        }
        foreach ($cssFileList as $file){
            $meta .= $this->cssAdder($file,false);
        }

        return $meta;
    }

    public function indexFiles () {
        $meta = "";

        $jsLibFileList = [];
        $jsFileList = [
            $this->js_component_index,
        ];
        $cssLibFileList = [];
        $cssFileList = [];

        foreach ($jsLibFileList as $file){
            $meta .= $this->jsAdder($file,true);
        }
        foreach ($jsFileList as $file){
            $meta .= $this->jsAdder($file,false);
        }
        foreach ($cssLibFileList as $file){
            $meta .= $this->cssAdder($file,true);
        }
        foreach ($cssFileList as $file){
            $meta .= $this->cssAdder($file,false);
        }

        return $meta;
    }

    public function addCommandFiles () {
        $meta = "";

        $jsLibFileList = [];
        $jsFileList = [
            $this->js_component_addCommand,
        ];
        $cssLibFileList = [];
        $cssFileList = [];

        foreach ($jsLibFileList as $file){
            $meta .= $this->jsAdder($file,true);
        }
        foreach ($jsFileList as $file){
            $meta .= $this->jsAdder($file,false);
        }
        foreach ($cssLibFileList as $file){
            $meta .= $this->cssAdder($file,true);
        }
        foreach ($cssFileList as $file){
            $meta .= $this->cssAdder($file,false);
        }

        return $meta;
    }

    public function requireFilesFooter(){
        $meta = "";

        $jsFileList = [
            $this->js_vueUInstant,
        ];

        foreach ($jsFileList as $file){
            $meta .= $this->jsAdder($file,false);
        }

        return $meta;
    }
}