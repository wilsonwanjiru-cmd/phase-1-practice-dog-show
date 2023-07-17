document.addEventListener('DOMContentLoaded', () => {
    // Fetch and render the list of registered dogs
    function fetchDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          renderDogs(dogs);
        })
        .catch(error => {
          console.error('Error fetching dogs:', error);
        });
    }
  
    // Render the list of dogs in the table
    function renderDogs(dogs) {
      const tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';
  
      dogs.forEach(dog => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button class="edit-button" data-dog-id="${dog.id}">Edit</button></td>
        `;
        tableBody.appendChild(row);
      });
  
      addEditButtonListeners();
    }
  
    // Add event listeners to the edit buttons
    function addEditButtonListeners() {
      const editButtons = document.querySelectorAll('.edit-button');
      editButtons.forEach(button => {
        button.addEventListener('click', () => {
          const dogId = button.dataset.dogId;
          selectDog(dogId);
          populateFormWithDogData(dogId);
        });
      });
    }
  
    // Select the dog and highlight the button
    function selectDog(dogId) {
      const editButtons = document.querySelectorAll('.edit-button');
      editButtons.forEach(button => {
        if (button.dataset.dogId === dogId) {
          button.classList.add('selected');
        } else {
          button.classList.remove('selected');
        }
      });
    }
  
    // Populate the form with the dog's current information
    function populateFormWithDogData(dogId) {
      const form = document.getElementById('dog-form');
      const nameInput = form.elements['name'];
      const breedInput = form.elements['breed'];
      const sexInput = form.elements['sex'];
  
      fetch(`http://localhost:3000/dogs/${dogId}`)
        .then(response => response.json())
        .then(dog => {
          nameInput.value = dog.name;
          breedInput.value = dog.breed;
          sexInput.value = dog.sex;
        })
        .catch(error => {
          console.error('Error fetching dog data:', error);
        });
    }
  
    // Submit the form and update the dog's information
    function submitForm(event) {
      event.preventDefault();
  
      const form = document.getElementById('dog-form');
      const nameInput = form.elements['name'];
      const breedInput = form.elements['breed'];
      const sexInput = form.elements['sex'];
  
      const dogId = getSelectedDogId();
  
      if (dogId) {
        const updatedDog = {
          name: nameInput.value,
          breed: breedInput.value,
          sex: sexInput.value,
        };
  
        fetch(`http://localhost:3000/dogs/${dogId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDog),
        })
          .then(response => response.json())
          .then(() => {
            fetchDogs();
            form.reset();
          })
          .catch(error => {
            console.error('Error updating dog information:', error);
          });
      } else {
        console.error('No dog selected.');
      }
    }
  
    // Get the ID of the currently selected dog
    function getSelectedDogId() {
      const editButtons = document.querySelectorAll('.edit-button');
      for (let i = 0; i < editButtons.length; i++) {
        if (editButtons[i].classList.contains('selected')) {
          return editButtons[i].dataset.dogId;
        }
      }
      return null;
    }
  
    // Add event listener to form submit
    const form = document.getElementById('dog-form');
    form.addEventListener('submit', submitForm);
  
    // Fetch and render the initial list of dogs
    fetchDogs();
  });
  