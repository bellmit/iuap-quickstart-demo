define("teams/form/formcolor",
function() {
    return {
        data: "#1cb1e7 #f9a900 #ffc32e #1cb1e7 #f75e8d #5ec9f7 #ff8f6a #3ac3b5 #78c16e #ff953d #78c16c #9b89b9 #78919d #5c6ac1 #5e97f7 #f75e8c #ff8f6a #3ac3b5 #9b89b9 #ff8f6a #a1897e #ff8f6a #9b89b9 #f75e8d #a1897e #ff953d #78c16e #3ac3b5 #a1897e #bd85cd #5ec9f7 #f75e5e #f7bf26 #5c6ac1 #f7bf26 #bd85cd #f75e5e #78919d #5ec9f7 #78c16e #f36666 #ff608f #7066e3 #ff784a #1acf8d #4693f9 #81d12c #7066e3 #b774d3 #81d12c #7066e3 #ff784a #00c3eb #ff9702 #3497f1 #81d12c #ff9700 #00c3eb #1acf8d #f96a6a #81d12c #b774d3 #ff608f #ff5e32 #df3030 #df3058 #46addd #5874bf #5ec956 #f15e4a".split(" "),
        getRandomColor: function() {
            var f = this.data;
            return f[Math.floor(Math.random() * f.length)]
        },
        getColor: function(f) {
            var d = this.data;
            f = f > d.length ? d.length: f;
            return d[f]
        }
    }
});
