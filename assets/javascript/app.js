var openScenario

function registerHandlers(hideOnLoad) {
  var isAnyScenarioOpen = false

  var body = document.getElementsByTagName('body')[0]
  var fullHeightToggle = document.querySelector('.js-full-height')
  var rangeInput = document.getElementById('slider')
  var imageWrapper = document.getElementsByClassName('image-wrapper')
  var imageTitle = document.getElementsByClassName('image-title')
  var imageNote = document.getElementsByClassName('note')
  var allToggle = document.querySelector('.all-toggle')
  var openAll = document.querySelector('.js-open-all')
  var closeAll = document.querySelector('.js-close-all')
  var toolBar = document.querySelector('.toolbar')
  var images = document.getElementsByClassName('image')
  var imagesSet = document.getElementsByClassName('image-set-images')
  var imageSetTitles = document.getElementsByClassName('image-set-title')

  toolBar.style.display = 'none'

  function addDragDrop() {
    var imageSetContainers = Array.from(document.querySelectorAll('.image-set-images'))

    var draggableImageSets = dragula({
      containers: imageSetContainers,
      direction: 'horizontal'
    })

    draggableImageSets.on('drop', function (e) {
      var imageSet = e.parentElement
      var title = imageSet.parentElement.querySelector('.image-set-title')
      handleImageOrderChange(imageSet, title)
    })
  }

  function scenarioOpened() {
    isAnyScenarioOpen = true
    openAll.style.display = 'none'
    closeAll.style.display = 'inline'
    toolBar.style.display = 'block'
    addDragDrop()
  }

  function allScenariosClosed () {
    isAnyScenarioOpen = false
    // Hide toolbar
    openAll.style.display = 'inline'
    closeAll.style.display = 'none'
    toolBar.style.display = 'none'
  }

  function closeScenario (scenarioElement) {
    scenarioElement.nextElementSibling.style.display = 'none'
    scenarioElement.nextElementSibling.classList.remove('open')

    if (!areImageSetsOpen()) {
      allScenariosClosed()
    }
  }

  openScenario = function openScenario (scenarioElement) {
    scenarioElement.nextElementSibling.style.display = 'block'
    scenarioElement.nextElementSibling.classList.add('open')
    scenarioOpened()
  }

  function toggleScenario (scenarioElement) {
    if (scenarioElement.nextElementSibling.style.display === 'none') {
      openScenario(scenarioElement)
    } else {
      closeScenario(scenarioElement)
    }
  }

  function changeScreen (image, btnControl, forwards) {
    image.querySelector(btnControl).onclick = function (e) {
      e.stopPropagation()
      var currentImage = this.parentNode.parentNode
      currentImage.classList.remove('zoomed-in')

      if (forwards) {
        moveScreenForwards(currentImage)
      } else {
        moveScreenBackwards(currentImage)
      }
    }
  }

  function moveScreenForwards (currentImage) {
    var nextImage = currentImage.nextElementSibling

    if (nextImage) {
      nextImage.classList.add('zoomed-in')
    }
  }

  function moveScreenBackwards (currentImage) {
    var previousImage = currentImage.previousElementSibling

    if (previousImage) {
      previousImage.classList.add('zoomed-in')
    }
  }

  function loopAllImages () {
    for (var i = 0; i <= images.length - 1; i++) {
      images[i].onclick = function () {
        this.classList.add('zoomed-in')
        document.querySelector('body').classList.add('js-zoomed')
        document.querySelector('html').classList.add('noscroll')
      }

      // Add data attributes to the images
      images[i].setAttribute('data-number', i.toString())

      // Get all next and previous buttons and call functions
      changeScreen(images[i], '.js-next-screen', true)
      changeScreen(images[i], '.js-prev-screen')

      // Close the screens
      images[i].querySelector('.js-close-screen').onclick = function (e) {
        e.stopPropagation()
        var currentImage = this.parentNode.parentNode
        currentImage.classList.remove('zoomed-in')
        document.querySelector('body').classList.remove('js-zoomed')
        document.querySelector('html').classList.remove('noscroll')
      }
    }
  }

  function loopImageSets () {
    // Close the screens and hide the toolbar onload
    for (var i = 0; i <= imagesSet.length - 1; i++) {
      imagesSet[i].style.display = 'none'
    }
  }

  function loopImageSetTitles () {
    // Close the screens and hide the toolbar onload
    for (var i = 0; i <= imageSetTitles.length - 1; i++) {
      imageSetTitles[i].onclick = function () {
        toggleScenario(this)
      }
    }
  }

  function updateSlider (slideAmount) {
    for (var i = 0; i <= imageWrapper.length - 1; i++) {
      imageWrapper[i].style['font-size'] = slideAmount + '%'

      // Allow v-scroll if zoom is over 100%
      if (slideAmount > 100) {
        imageWrapper[i].classList.add('scrollable')
      } else if (slideAmount <= 100) {
        imageWrapper[i].classList.remove('scrollable')
      }

      // Hide captions if zoom is less than 50%
      if (slideAmount > 50) {
        imageTitle[i].classList.remove('hidden')
      } else if (slideAmount <= 50) {
        imageTitle[i].classList.add('hidden')
      }

      // Hide captions if zoom is less than 50%
      if (slideAmount > 300) {
        imageNote[i].classList.add('visible')
      } else if (slideAmount <= 300) {
        imageNote[i].classList.remove('visible')
      }
    }
  }

  function areImageSetsOpen () {
    for (var i = 0; i <= imagesSet.length - 1; i++) {
      if (imagesSet[i].style.display === 'block') {
        return true
      }
    }
    return false
  }

  // Toggle the image sets
  allToggle.onclick = function () {
    if (isAnyScenarioOpen) {
      var toggleScenario = closeScenario
    } else {
      toggleScenario = openScenario
    }

    for (var i = 0; i <= imageSetTitles.length - 1; i++) {
      toggleScenario(imageSetTitles[i])
    }
  }

  // Full height images toggle
  fullHeightToggle.onclick = function () {
    body.classList.toggle('full-height')
  }

  // Slider for zooming screens
  rangeInput.oninput = function () {
    updateSlider(rangeInput.value)
  }

  // Run functions
  loopAllImages()

  if (hideOnLoad) {
    loopImageSetTitles()
    loopImageSets()
  }
}

document.addEventListener('DOMContentLoaded', function () {
  registerHandlers(true)
})

window.Handlebars.registerHelper('math', function (lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue)
  rvalue = parseFloat(rvalue)

  return {
    '+': lvalue + rvalue,
    '-': lvalue - rvalue,
    '*': lvalue * rvalue,
    '/': lvalue / rvalue,
    '%': lvalue % rvalue
  }[operator]
})

var template = document.getElementById('template').innerHTML

function applyData (data) {
  document.getElementById('content').innerHTML = window.Handlebars.compile(template)(data)
}

applyData(window.data)

window.handleSaveNoteClick = function () {
  var body = getNoteDetails()

  window.fetch('/save-note', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new window.Headers({
      'Content-Type': 'application/json'
    })
  }).then(function (response) {
    return response.json()
  }).then(function (data) {
    applyData(data)
  }).then(function () {
    reapplyImageZoom(body.path.caption, body.userJourney.title)
    registerHandlers(false)
  })
}

function reapplyImageZoom (caption, title) {
  var activeJourneyElement = Array.from(document.querySelectorAll('.image-set-title')).find(function (el) {
    // remove any leading numbers that match the format (1. ) incl. space
    return el.innerText.replace(/\d+\.\s/g, '') === title
  })

  var activeImageElement = Array.from(activeJourneyElement.parentElement.querySelectorAll('.image')).find(function (el) {
    return el.querySelector('.image-title .path').innerText === caption
  })

  // loop through image sets, to their titles, match against edited from getNoteDetails()
  activeImageElement.parentElement.style.display = 'block'
  activeImageElement.classList.add('zoomed-in')
}

function formatTitle(title) {
  return title.replace(/\d+\.\s/g, "")
}

function getNoteDetails () {
  var path = document.querySelector('.image.zoomed-in .path').innerText
  var userJourneyTitle = document.querySelector('.image.zoomed-in .journey').innerText
  var note = document.querySelector('.image.zoomed-in .note-input').value
  // reliably get the service name in the exact format of the folder name
  var serviceName = window.location.pathname.replace('/service/', '').replace('/index.html', '')

  var activeUserJourney = window.data.userjourneys.find(function (userJourney) {
    return userJourney.title === userJourneyTitle
  })

  var activePath = activeUserJourney.path.find(function (pathItem) {
    return pathItem.caption === path
  })

  return {
    path: activePath,
    note: note,
    serviceName: serviceName,
    userJourney: activeUserJourney
  }
}

window.handleEditNoteClick = function () {
  var editButton = document.querySelector('.image.zoomed-in .note-edit-button')
  var input = document.querySelector('.image.zoomed-in .note-input')
  var noteDisplay = document.querySelector('.image.zoomed-in .note-display')
  var saveButton = document.querySelector('.image.zoomed-in .note-save-button')

  if (noteDisplay) {
    noteDisplay.style.display = 'none'
  }
  editButton.style.display = 'none'
  input.style.display = 'block'
  saveButton.style.display = 'block'
}
function handleImageOrderChange(imageSet, title) {
  var serviceName = window.location.pathname.replace('/service/', '').replace('/index.html', '')
  var images = Array.from(imageSet.querySelectorAll('.image')).map(function (image) {
    var note = image.querySelector('.note .note-display')

    return {
      caption: image.querySelector('.image-title .path').innerText,
      imgref: image.querySelector('.image-wrapper img').getAttribute('src'),
      note: note ? note.innerText : ''
    }
  })

  var request = {
    images: images,
    serviceName: serviceName,
    scenarioName: formatTitle(title.innerText)
  }

  fetch('/save-images', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(function (response) {
    return response.json()
  }).then(function (data) {
    applyData(data)
  }).then(function () {
    var imageSets = Array.from(document.querySelectorAll('.image-set-title'))
    var activeImageSet = imageSets.find(function (imageSet) {
      return imageSet.innerText === title.innerText
    })

    registerHandlers(true)
    openScenario(activeImageSet)
  })
}
