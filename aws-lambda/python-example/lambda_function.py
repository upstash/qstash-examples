import json
import os
import hmac
import hashlib
import base64
import time
import jwt


def lambda_handler(event, context):

    # parse the inputs
    current_signing_key = os.environ['QSTASH_CURRENT_SIGNING_KEY']
    next_signing_key = os.environ['QSTASH_NEXT_SIGNING_KEY']

    headers = event['headers']
    signature = headers['upstash-signature']
    url = 'https://{}'.format(event['requestContext']['domainName'])
    body = None
    if 'body' in event:
        body = event['body']


    # check verification now
    try:
        verify(signature, current_signing_key, body, url)
    except Exception as e:
        print("Failed to verify signature with current signing key:", e)
        try:
            verify(signature, next_signing_key, body, url)
        except Exception as e2:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "error": str(e2),
                }),
            }


    # Your logic here...

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "ok",
        }),
    }


def verify(jwt_token, signing_key, body, url):
    split = jwt_token.split(".")
    if len(split) != 3:
        raise Exception("Invalid JWT.")

    header, payload, signature = split

    message = header + '.' + payload
    generated_signature = base64.urlsafe_b64encode(hmac.new(bytes(signing_key, 'utf-8'), bytes(message, 'utf-8'), digestmod=hashlib.sha256).digest()).decode()

    if generated_signature != signature and signature + "=" != generated_signature :
        raise Exception("Invalid JWT signature.")

    decoded = jwt.decode(jwt_token, options={"verify_signature": False})
    sub = decoded['sub']
    iss = decoded['iss']
    exp = decoded['exp']
    nbf = decoded['nbf']
    decoded_body = decoded['body']

    if iss != "Upstash":
        raise Exception("Invalid issuer: {}".format(iss))
    
    if sub != url:
        raise Exception("Invalid subject: {}".format(sub))

    now = time.time()
    if now > exp:
        raise Exception("Token has expired.")

    if now < nbf:
        raise Exception("Token is not yet valid.")


    if body != None:
        while decoded_body[-1] == "=":
            decoded_body = decoded_body[:-1]

        m = hashlib.sha256()
        m.update(bytes(body, 'utf-8'))
        m = m.digest()
        generated_hash = base64.urlsafe_b64encode(m).decode()

        if generated_hash != decoded_body and generated_hash != decoded_body + "=" :
                raise Exception("Body hash doesn't match.")
  
