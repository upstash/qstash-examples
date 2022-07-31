zip: lambda_function.py
	zip my-deployment-package.zip lambda_function.py && pip install --target ./package pyjwt && cd package && zip -r ../my-deployment-package.zip * && cd .. && rm -r package