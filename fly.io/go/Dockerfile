FROM golang:1.18

WORKDIR /flyio-qstash

COPY go.sum go.mod ./
RUN go mod download



COPY . .


RUN go build -o bin/app ./main.go



CMD ["bin/app"]