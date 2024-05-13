let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () =>{
    loginForm.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    loginForm.classList.remove('active');
}

window.onscroll = () =>{
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

const form = document.getElementById('photoForm');
const deleteButton = document.getElementById('deleteButton');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Photo uploaded / updated successfully!');
            form.reset();
        } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

function deleteRow(id) {
    fetch(`/delete/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log(data); // Log success message
      // Optionally, remove the row from the HTML table on successful deletion
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }

deleteButton.addEventListener('click', async () => {
    const confirmation = confirm('Are you sure you want to delete this photo?');

    if (confirmation) {
        try {
            // You need to implement delete logic here
            alert('Photo deleted successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    }
});
