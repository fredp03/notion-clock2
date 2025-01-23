var Clock = (function(){
    var exports = function(element) {
        this._element = element;
        var html = '';
        for (var i=0; i<4; i++) { // Changed from 6 to 4 digits
            html += '<span>&nbsp;</span>';
        }
        this._element.innerHTML = html;
        this._slots = this._element.getElementsByTagName('span');
        this._tick();
        
        // Fixed scaling implementation
        this._scale = 1.0;
        
        this._element.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._scale = Math.min(3, this._scale + 0.1); // Add upper limit
            this._updateScale();
        });
        
        this._element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
                if (e.detail === 1) { // Make sure it's a single click
                    this._scale = Math.max(0.3, this._scale - 0.1); // Add lower limit
                    this._updateScale();
                }
            }, 200);
        });
    };

    exports.prototype = {
        _tick:function() {
            var time = new Date();
            this._update(this._pad(time.getHours()) + this._pad(time.getMinutes())); // Removed seconds
            var self = this;
            setTimeout(function(){
                self._tick();
            },1000);
        },

        _pad:function(value) {
            return ('0' + value).slice(-2);
        },

        _update:function(timeString) {

            var i=0,l=this._slots.length,value,slot,now;
            for (;i<l;i++) {

                value = timeString.charAt(i);
                slot = this._slots[i];
                now = slot.dataset.now;

                if (!now) {
                    slot.dataset.now = value;
                    slot.dataset.old = value;
                    continue;
                }

                if (now !== value) {
                    this._flip(slot,value);
                }
            }
        },

        _flip:function(slot,value) {

            // setup new state
            slot.classList.remove('flip');
            slot.dataset.old = slot.dataset.now;
            slot.dataset.now = value;

            // force dom reflow
            slot.offsetLeft;

            // start flippin
            slot.classList.add('flip');

        },

        _updateScale: function() {
            requestAnimationFrame(() => {
                this._element.style.transform = `scale(${this._scale})`;
            });
        }

    };

    return exports;
}());

var i=0,clocks = document.querySelectorAll('.clock'),l=clocks.length;
for (;i<l;i++) {
    new Clock(clocks[i]);
}
