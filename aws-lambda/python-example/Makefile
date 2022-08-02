zip:
	rm -rf dist
	pip3 install --target ./dist pyjwt
	cp lambda_function.py ./dist/lambda_function.py
	cd dist
	zip -r lambda.zip .
	

deploy: zip
	aws lambda update-function-code --function-name sdks-qstash-quickstart-python --zip-file fileb://./lambda.zip
