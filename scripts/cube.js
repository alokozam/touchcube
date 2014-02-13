(function(){

    var scene = document.getElementById('scene'),
        cube = document.getElementById('cube'),
        sensivity = 40, // %
        cubePosition = {
            rotateX: 0,
            rotateY: 0,
            scale: 1
        },

        clone = function(obj){
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },

        calculateTransformation = function(rotX, rotY, scale){
            return 'rotateX('+rotX+'deg) rotateY('+rotY+'deg) scale3d('+scale+','+scale+','+scale+')';
        },

        drawRotation = function(){
            cube.style.webkitTransform = calculateTransformation(cubePosition.rotateX, cubePosition.rotateY, cubePosition.scale);

            animationLoopId = window.webkitRequestAnimationFrame(drawRotation, scene);
        },

        startDrawing = function(){
            drawRotation();
        },

        stopDrawing = function(){
            window.webkitCancelAnimationFrame(animationLoopId);
        },

        animationLoopId,
        initialPosition,
        calculatedPosition,
        pinchLock;


    Hammer(scene,{
        prevent_default: true
    })
        .on('touch', function(eTouch){
            startDrawing();

            initialPosition = clone(cubePosition),
                calculatedPosition = clone(cubePosition);

        })
        .on('drag', function(eRot){

            if(pinchLock) return;

            calculatedPosition.rotateX = ( initialPosition.rotateX - eRot.gesture.deltaY * sensivity/100 ) % 360,
                calculatedPosition.rotateY = ( initialPosition.rotateY + eRot.gesture.deltaX * sensivity/100 ) % 360;

            cubePosition = clone(calculatedPosition);
        })
        .on('pinch', function(eZoom) {

            pinchLock = true;
            calculatedPosition.scale = eZoom.gesture.scale > 1 ? calculatedPosition.scale + sensivity/2500 : calculatedPosition.scale - sensivity/2500;

            if( calculatedPosition.scale<0.1 || calculatedPosition.scale>5 ) return;

            cubePosition = clone(calculatedPosition);
        })
        .on('release', function(eRelease){

            stopDrawing();
            pinchLock = false;

        });


})();