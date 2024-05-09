var user_templates = require("@ts/user_templates.json");
var demo_templates = require("@ts/demo_templates.json");
var element_templates = require("@ts/element_templates.json");
var product_images = require("@ts/product_images.json");
var default_images = require("@ts/default_images.json");
var short_tags = require("@ts/short_tags.json");
var canvas_sizes = require("@ts/canvas_sizes.json");

export function get_user_template() {
    return user_templates.user_templates.map((item) => {
        return {
            id: item.id,
            name: item.name,
            image_url: item.image_url
        };
    });
}

export function get_user_temp_by_id(id) {
    return user_templates['user_templates'].find((item) => {
        return item.id == id;
    });
}

export function get_all_temps() {
    return demo_templates.demo_templates.map((item, i) => {
        return {
            id: item.id,
            name: item.name,
            group_type: item.group_type,
            image_url: item.image_url
        };
    });
}

export function get_temp_by_id(id) {
    return demo_templates['demo_templates'].find((item) => {
        return item.id == id;
    });
}


export function get_preview_image(keyword) {
    var product_images_json = product_images['product_images'];
    function randomNum_create(max, min) {
        let arr = [];
        for (i = 0; i < max; i++) {
            x = Math.floor(Math.random() * max) + min;
            if (arr.includes(x) == true) {
                i = i - 1;
            } else {
                if (x > max == false) {
                    arr.push(x);
                }
            }
        }
        return arr;
    }
    function getProductByRandom(randomNum) {
        let data = [];
        [0, 0, 0, 0, 0].forEach((arg, i) => {
            product_images_json.forEach((element, index) => {
                if (index == randomNum[i]) {
                    data.push(element);
                }
            });
            if (i == 4) {
                return false;
            }
        });
        return data;
    }
    if (keyword == '') {
        let randomNum = randomNum_create(8, 0);
        getProductByRandom(randomNum);
        return data;
    } else {
        var data = [];
        product_images_json.forEach((item, index) => {
            if (item.id.indexOf(keyword) != -1 || item.title.indexOf(keyword) != -1 || item.brand.indexOf(keyword) != -1) {
                data.push(item);
            }
        });
        if (data.length == 0) {
            let randomNum = randomNum_create(8, 0);
            getProductByRandom(randomNum);
        } else {
            return data;
        }
    }
}

export function get_all_default_images() {
    return product_images['product_images'];
}


export function get_all_elements() {
    return element_templates.element_templates.map((item) => {
        return {
            id: item.id,
            name: item.name,
            image_url: item.image_url,
            group_type: item.group_type
        };
    });
}

export function get_element_by_id(id) {
    return element_templates['element_templates'].find((item) => {
        return item.id == id;
    });
}

export function get_canvas_sizes() {
    return canvas_sizes.canvas_sizes;
}

export function get_short_tags() {
    return short_tags.short_tags;
}
