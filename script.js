$('#clock').fitText(1.3);

function update() {
  $('#clock').html(moment().format('D. MMMM YYYY H:mm'));
}

setInterval(update, 1000);
