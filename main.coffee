W = window
W.img = new Image

main = ->
	context = canvas.getContext '2d'
	
	context.path [
			[0,0]
			[0,canvas.height]
			[canvas.width,canvas.height]
			[canvas.width,0]
		]
	context.stroke()

	context.font = "20px sans-serif"

	context.fillText "Drag and drop the JSON (from TexturePacker) and the tilesheet to here!",50,50

	canvas.addEventListener "dragenter", (evt) ->
		evt.stopPropagation()
		evt.preventDefault()
	canvas.addEventListener "dragexit", (evt) ->
		evt.stopPropagation()
		evt.preventDefault()
	canvas.addEventListener "dragover", (evt) ->
		evt.stopPropagation()
		evt.preventDefault()
	canvas.addEventListener "drop", (evt) ->
		evt.stopPropagation()
		evt.preventDefault()

		files = evt.dataTransfer.files
		if files.length > 0
			for file in files
				reader = new FileReader
				if file.type.startsWith "image"
					reader.onload = (evt) ->
						W.img.src = evt.target.result
						canvas.width = W.img.width
						canvas.height = W.img.height
					reader.readAsDataURL file
				else if file.type.endsWith "json"
					reader.onload = (evt) ->
						data = JSON.parse evt.target.result
						handle data
					reader.readAsText file

redrawimages = () ->
	canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
	if W.img.src
		canvas.getContext('2d').drawImage W.img, 0,0,canvas.width,canvas.height

handle = (data) ->
	imgs = []
	for name, frame of data.frames
		name = name.match(/[^\/]*$/)[0].match(/^[^\.]*/)[0] + ".json"
		imgs.push [frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, name]
	addclickhandler(imgs)

addclickhandler = (imgs) ->
	canvas.addEventListener 'mousemove', (evt) ->
		redrawimages()
		for rect in imgs
			if evt.inside rect
				context = canvas.getContext('2d')
				context.lineWidth = 2
				context.font = "20px sans-serif"

				context.path [
					[rect[0]+5, rect[1]+5]
					[rect[0]-5 + rect[2], rect[1]+5]	
					[rect[0]-5 + rect[2], rect[1] + rect[3]-5]
					[rect[0]+5, rect[1] + rect[3]-5]
				]
				
				context.stroke()
				context.fillText rect[4], rect[0]+10,rect[1]+rect[3]-10
				return


MouseEvent::inside = (rect) ->
	@offsetX > rect[0] and
	@offsetY > rect[1] and 
	@offsetX < rect[0] + rect[2] and
	@offsetY < rect[1] + rect[3]

CanvasRenderingContext2D::path = (arr) ->
	@beginPath()
	for pt, i in arr
		if i == 0? @moveTo(pt[0], pt[1]) else @lineTo(pt[0], pt[1])
	@closePath()

String::startsWith = (s) ->
	this[...s.length] == s

String::endsWith = (s) ->
	this[this.length-s.length...] == s

every = (ms, fn) ->
	setInterval(fn, ms)

document.addEventListener 'DOMContentLoaded', main