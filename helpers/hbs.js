const e = require("express");
const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  compare: function (arg1, arg2) {
    console.log("Argument1 " + arg1 + "Argument 2 " + arg2);
    if (arg1 === arg2) {
      return 'selected'
    } else {
      return ''
    }
  },
  allowLike: function (likedBy, user) {
    for (let i = 0; i < likedBy.length; i++) {
      if (String(likedBy[i]._id) === String(user._id)) {
        console.log("printing return");
        return "hidden"
      }
    }
    return ""
  },
  equal: function (arg1, arg2) {
    if (arg1 === arg2) return true
    return false
  },
  log(arg1) {
    console.log('Logging from helpers');
    console.log(arg1._id.toString())
  }
}