var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');

function initCards() {
    var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

    newCards.forEach(function (card, index) {
        card.style.zIndex = allCards.length - index;
        card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        card.style.opacity = (10 - index) / 10;
    });
    
    tinderContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
    var hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
        el.classList.add('moving');
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
        el.classList.remove('moving');
        var keep = Math.abs(event.deltaX) < 100;

        if (keep) {
            event.target.style.transform = '';
        } else {
            var endX = Math.max(Math.abs(event.velocityX) * uTinderContainerWidth, uTinderContainerWidth);
            var toX = event.deltaX > 0 ? endX : -endX;
            event.target.style.transform = 'translate(' + toX + 'px, ' + (event.deltaY + toX) + 'px) rotate(30deg)';
            el.classList.add('removed');
            initCards();
        }
    });
});