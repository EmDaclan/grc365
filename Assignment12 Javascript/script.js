document.addEventListener('DOMContentLoaded', () => {
    const growButton = document.getElementById('grow-button');
    const apple = document.getElementById('apple');
    const bucket = document.getElementById('bucket');
    
    let isDragging = false;
    let offsetX, offsetY;
	
	apple.style.position = 'absolute';
	apple.style.left= '-180px';
	apple.style.top= '20px';
   
    growButton.addEventListener('click', () => {
        if (!apple.classList.contains('hidden-apple')) {
            console.log("Apple already grown!");
            return;
        }
        
        apple.classList.remove('hidden-apple');
    });

    apple.addEventListener('mousedown', (e) => {
        if (apple.classList.contains('hidden-apple')) return; 
        
        isDragging = true;
        
        const rect = apple.getBoundingClientRect();
        
        // **CRITICAL FIX:** Set the fixed position explicitly BEFORE calculating offsets.
        // This stops the element from jumping based on its negative absolute coordinates.
        apple.style.left = `${rect.left}px`;
        apple.style.top = `${rect.top}px`;
        apple.style.position = 'fixed'; 

        // Calculate the mouse offset relative to the new fixed position
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        apple.style.zIndex = 1000;
        apple.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        apple.style.left = `${e.clientX - offsetX}px`;
        apple.style.top = `${e.clientY - offsetY}px`;
		const appleRect = apple.getBoundingClientRect();
        if (checkCollision(appleRect, bucket.getBoundingClientRect())) { // Recalculate bucket position just in case
            bucket.classList.add('drop-target-hover');
        } else {
            bucket.classList.remove('drop-target-hover');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        apple.style.left = `${e.clientX - offsetX}px`;
        apple.style.top = `${e.clientY - offsetY}px`;

        const appleRect = apple.getBoundingClientRect();
        if (checkCollision(appleRect, bucket.getBoundingClientRect())) { 
            bucket.classList.add('drop-target-hover');
        } else {
            bucket.classList.remove('drop-target-hover');
        }
    });

    // Stop Dragging / Drop
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        apple.style.zIndex = 1; 
        apple.style.cursor = 'grab'; 
        bucket.classList.remove('drop-target-hover'); 

        const appleRect = apple.getBoundingClientRect();
        const currentBucketRect = bucket.getBoundingClientRect();

        if (checkCollision(appleRect, currentBucketRect)) {
            apple.classList.add('hidden-apple');
            
            setTimeout(() => {
                apple.style.position = 'absolute'; 
                // Maintain your required position for tree alignment
                apple.style.left= '-180px'; 
                apple.style.top= '20px';
            }, 500); 
            
            console.log("Apple Collected!");
        } else {
            // Dropped elsewhere - Calculate the new absolute position relative to the container
            
            const parent = document.getElementById('tree-and-apple-container');
            const parentRect = parent.getBoundingClientRect();

            apple.style.position = 'absolute';
            apple.style.left = `${appleRect.left - parentRect.left}px`;
            apple.style.top = `${appleRect.top - parentRect.top}px`;
        }
    });

    function checkCollision(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }
});