function Bite(id, post_title, post_content, category, link) {
    this.id = id;
    this.post_title = post_title;
    this.post_content = post_content;
    this.category = category;
    this.link = link;
}

function Bites() {
    var self = this,
        items = [],
        lookup = {};

    self.add = function(item) {
        items.push(item);
        lookup[item.id] = items[items.length - 1]
    }
    self.remove = function(id) {
        if ((index = items.indexOf(lookup[id])) > -1) {
            items.splice(index, 1);
            delete lookup[id];
        }
    }
    self.get = function(id) {
        if (lookup[id] === undefined) {
            return null;
        }
        return lookup[id];
    }
    self.getAll = function() {
        return items;
    }
}