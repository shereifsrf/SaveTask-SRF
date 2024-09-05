package common

import (
	"fmt"
	"runtime"
	"strings"
)

func GetFnName(skip int) string {
	pc, _, _, _ := runtime.Caller(skip)
	return runtime.FuncForPC(pc).Name()
}

func WithFnName(log string) string {
	fn := GetFnName(2)
	// get the last separated by .
	fns := strings.Split(fn, ".")
	fnName := fns[len(fns)-1]

	return fmt.Sprintf("%v(): %v", fnName, log)
}

func ContainsString[T comparable](slice []T, s T) bool {
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}
