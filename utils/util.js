const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  parseTime: parseTime,
  formatDate: formatDate
}

function formatDate(date) {
  var dates = date.split("/");
  if (dates.length == 3) {
    if (dates[1].length == 1) {
      dates[1] = "0" + dates[1];
    }
    if (dates[2].length == 1) {
      dates[2] = "0" + dates[2];
    }
    date = dates.join("-");
    return date;
  } else {
    return null;
  }
}

function parseTime(timestamp) {
  var date = new Date(parseInt(timestamp)).toLocaleDateString();
  　　//输出结果为2016/8/9
  date = formatDate(date);
  return date;
}