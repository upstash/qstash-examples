zip:
	pip3 install --target ./dist pyjwt
	cp lambda_function.py ./dist/lambda_function.py
	zip -r lambda.zip ./dist
	rm -rf ./dist

deploy: zip
	aws lambda update-function-code --function-name sdks-qstash-quickstart-python --zip-file fileb://lambda.zip

