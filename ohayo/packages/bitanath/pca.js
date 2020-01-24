var PCA = (function() {
  /**
   * The first step is to subtract the mean and center data
   *
   * @param {Array} matrix - data in an mXn matrix format
   * @returns
   */
  function computeDeviationMatrix(matrix) {
    var unit = unitSquareMatrix(matrix.length)
    return subtract(matrix, scale(multiply(unit, matrix), 1 / matrix.length))
  }
  /**
   * Computes variance from deviation
   *
   * @param {Array} deviation - data minus mean as calculated from computeDeviationMatrix
   * @returns
   */
  function computeDeviationScores(deviation) {
    var devSumOfSquares = multiply(transpose(deviation), deviation)
    return devSumOfSquares
  }
  /**
   * Calculates the var covar square matrix using either population or sample
   *
   * @param {Array} devSumOfSquares
   * @param {boolean} sample - true/false whether data is from sample or not
   * @returns
   */
  function computeVarianceCovariance(devSumOfSquares, sample) {
    var varianceCovariance
    if (sample) varianceCovariance = scale(devSumOfSquares, 1 / (devSumOfSquares.length - 1))
    else varianceCovariance = scale(devSumOfSquares, 1 / devSumOfSquares.length)
    return varianceCovariance
  }
  /**
   * Matrix is the deviation sum of squares as computed earlier
   *
   * @param {Array} matrix - output of computeDeviationScores
   * @returns
   */
  function computeSVD(matrix) {
    var result = svd(matrix)
    var eigenvectors = result.U
    var eigenvalues = result.S
    var results = eigenvalues.map(function(value, i) {
      var obj = {}
      obj.eigenvalue = value
      obj.vector = eigenvectors.map(function(vector, j) {
        return -1 * vector[i] //HACK prevent completely negative vectors
      })
      return obj
    })
    return results
  }
  /**
   * Get reduced dataset after removing some dimensions
   *
   * @param {Array} data - initial matrix started out with
   * @param {rest} vectors - eigenvectors selected as part of process
   * @returns
   */
  function computeAdjustedData(data, ...vectorObjs) {
    //FIXME no need to transpose vectors since they're already in row normal form
    var vectors = vectorObjs.map(function(v) {
      return v.vector
    })
    var matrixMinusMean = computeDeviationMatrix(data)
    var adjustedData = multiply(vectors, transpose(matrixMinusMean))
    var unit = unitSquareMatrix(data.length)
    var avgData = scale(multiply(unit, data), -1 / data.length) //NOTE get the averages to add back

    var formattedAdjustData = formatData(adjustedData, 2)
    return {
      adjustedData: adjustedData,
      formattedAdjustedData: formattedAdjustData,
      avgData: avgData,
      selectedVectors: vectors
    }
  }

  /**
   * Get original data set from reduced data set (decompress)
   * @param {*} adjustedData = formatted or unformatted adjusted data
   * @param {*} vectors = selectedVectors
   * @param {*} avgData = avgData
   */
  function computeOriginalData(adjustedData, vectors, avgData) {
    var originalWithoutMean = transpose(multiply(transpose(vectors), adjustedData))
    var originalWithMean = subtract(originalWithoutMean, avgData)
    var formattedData = formatData(originalWithMean, 2)
    return {
      originalData: originalWithMean,
      formattedOriginalData: formattedData
    }
  }

  /**
   * Get percentage explained, or loss
   * @param {*} vectors
   * @param {*} selected
   */
  function computePercentageExplained(vectors, ...selected) {
    var total = vectors
      .map(function(v) {
        return v.eigenvalue
      })
      .reduce(function(a, b) {
        return a + b
      })
    var explained = selected
      .map(function(v) {
        return v.eigenvalue
      })
      .reduce(function(a, b) {
        return a + b
      })
    return explained / total
  }

  function getEigenVectors(data) {
    return computeSVD(computeVarianceCovariance(computeDeviationScores(computeDeviationMatrix(data)), false))
  }

  function analyseTopResult(data) {
    var eigenVectors = getEigenVectors(data)
    var sorted = eigenVectors.sort(function(a, b) {
      return b.eigenvalue - a.eigenvalue
    })
    var selected = sorted[0].vector
    return computeAdjustedData(data, selected)
  }

  function formatData(data, precision) {
    var TEN = Math.pow(10, precision || 2)
    return data.map(function(d, i) {
      return d.map(function(n) {
        return Math.round(n * TEN) / TEN
      })
    })
  }
  /**
   * Multiplies AxB, where A and B are matrices of nXm and mXn dimensions
   * @param {} a
   * @param {*} b
   */
  function multiply(a, b) {
    if (!a[0] || !b[0] || !a.length || !b.length) {
      throw new Error("Both A and B should be matrices")
    }

    if (b.length !== a[0].length) {
      throw new Error("Columns in A should be the same as the number of rows in B")
    }
    var product = []

    for (var i = 0; i < a.length; i++) {
      product[i] = [] //initialize a new row
      for (var j = 0; j < b[0].length; j++) {
        for (var k = 0; k < a[0].length; k++) {
          product[i][j] = !!product[i][j] ? product[i][j] + a[i][k] * b[k][j] : a[i][k] * b[k][j]
        }
      }
    }
    return product
  }
  /**
   * Utility function to subtract matrix b from a
   *
   * @param {any} a
   * @param {any} b
   * @returns
   */
  function subtract(a, b) {
    if (!(a.length === b.length && a[0].length === b[0].length)) throw new Error("Both A and B should have the same dimensions")
    var result = []
    for (var i = 0; i < a.length; i++) {
      result[i] = []
      for (var j = 0; j < b[0].length; j++) {
        result[i][j] = a[i][j] - b[i][j]
      }
    }
    return result
  }
  /**
   * Multiplies a matrix into a factor
   *
   * @param {any} matrix
   * @param {any} factor
   * @returns
   */
  function scale(matrix, factor) {
    var result = []
    for (var i = 0; i < matrix.length; i++) {
      result[i] = []
      for (var j = 0; j < matrix[0].length; j++) {
        result[i][j] = matrix[i][j] * factor
      }
    }
    return result
  }

  /**
   * Generates a unit square matrix
   * @param {*} rows = number of rows to fill
   */
  function unitSquareMatrix(rows) {
    var result = []
    for (var i = 0; i < rows; i++) {
      result[i] = []
      for (var j = 0; j < rows; j++) {
        result[i][j] = 1
      }
    }
    return result
  }
  /**
   * Transposes a matrix, converts rows to columns
   * @param {*} matrix
   */
  function transpose(matrix) {
    var operated = clone(matrix)
    return operated[0].map(function(m, c) {
      return matrix.map(function(r) {
        return r[c]
      })
    })
  }
  /**
   * Deep Clones a matrix
   * @param {*} arr
   */
  function clone(arr) {
    var string = JSON.stringify(arr)
    var result = JSON.parse(string)
    return result
  }

  /**
   * Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
   * From the Numeric JS Implementation Copyright (C) 2011 by Sébastien Loisel
   * The C implementation from which this has been taken may be found here: http://www.public.iastate.edu/~dicook/JSS/paper/code/svd.c
   * @param {*} A = m*n matrix
   */
  function svd(A) {
    var temp
    var prec = Math.pow(2, -52) // assumes double prec
    var tolerance = 1e-64 / prec
    var itmax = 50
    var c = 0
    var i = 0
    var j = 0
    var k = 0
    var l = 0
    var u = clone(A)
    var m = u.length
    var n = u[0].length

    if (m < n) throw "Need more rows than columns"

    var e = new Array(n) //vector1
    var q = new Array(n) //vector2
    for (i = 0; i < n; i++) e[i] = q[i] = 0.0
    var v = rep([n, n], 0)

    function pythag(a, b) {
      a = Math.abs(a)
      b = Math.abs(b)
      if (a > b) return a * Math.sqrt(1.0 + (b * b) / a / a)
      else if (b == 0.0) return a
      return b * Math.sqrt(1.0 + (a * a) / b / b)
    }

    //rep function
    function rep(s, v, k) {
      if (typeof k === "undefined") {
        k = 0
      }
      var n = s[k],
        ret = Array(n),
        i
      if (k === s.length - 1) {
        for (i = n - 2; i >= 0; i -= 2) {
          ret[i + 1] = v
          ret[i] = v
        }
        if (i === -1) {
          ret[0] = v
        }
        return ret
      }
      for (i = n - 1; i >= 0; i--) {
        ret[i] = rep(s, v, k + 1)
      }
      return ret
    }

    //Householder's reduction to bidiagonal form

    var f = 0.0
    var g = 0.0
    var h = 0.0
    var x = 0.0
    var y = 0.0
    var z = 0.0
    var s = 0.0

    for (i = 0; i < n; i++) {
      e[i] = g //vector
      s = 0.0 //sum
      l = i + 1 //stays i+1
      for (j = i; j < m; j++) s += u[j][i] * u[j][i]
      if (s <= tolerance) g = 0.0
      else {
        f = u[i][i]
        g = Math.sqrt(s)
        if (f >= 0.0) g = -g
        h = f * g - s
        u[i][i] = f - g
        for (j = l; j < n; j++) {
          s = 0.0
          for (k = i; k < m; k++) s += u[k][i] * u[k][j]
          f = s / h
          for (k = i; k < m; k++) u[k][j] += f * u[k][i]
        }
      }
      q[i] = g
      s = 0.0
      for (j = l; j < n; j++) s = s + u[i][j] * u[i][j]
      if (s <= tolerance) g = 0.0
      else {
        f = u[i][i + 1]
        g = Math.sqrt(s)
        if (f >= 0.0) g = -g
        h = f * g - s
        u[i][i + 1] = f - g
        for (j = l; j < n; j++) e[j] = u[i][j] / h
        for (j = l; j < m; j++) {
          s = 0.0
          for (k = l; k < n; k++) s += u[j][k] * u[i][k]
          for (k = l; k < n; k++) u[j][k] += s * e[k]
        }
      }
      y = Math.abs(q[i]) + Math.abs(e[i])
      if (y > x) x = y
    }

    // accumulation of right hand transformations
    for (i = n - 1; i != -1; i += -1) {
      if (g != 0.0) {
        h = g * u[i][i + 1]
        for (j = l; j < n; j++) v[j][i] = u[i][j] / h //u is array, v is square of columns
        for (j = l; j < n; j++) {
          s = 0.0
          for (k = l; k < n; k++) s += u[i][k] * v[k][j]
          for (k = l; k < n; k++) v[k][j] += s * v[k][i]
        }
      }
      for (j = l; j < n; j++) {
        v[i][j] = 0
        v[j][i] = 0
      }
      v[i][i] = 1
      g = e[i]
      l = i
    }

    // accumulation of left hand transformations
    for (i = n - 1; i != -1; i += -1) {
      l = i + 1
      g = q[i]
      for (j = l; j < n; j++) u[i][j] = 0
      if (g != 0.0) {
        h = u[i][i] * g
        for (j = l; j < n; j++) {
          s = 0.0
          for (k = l; k < m; k++) s += u[k][i] * u[k][j]
          f = s / h
          for (k = i; k < m; k++) u[k][j] += f * u[k][i]
        }
        for (j = i; j < m; j++) u[j][i] = u[j][i] / g
      } else for (j = i; j < m; j++) u[j][i] = 0
      u[i][i] += 1
    }

    // diagonalization of the bidiagonal form
    prec = prec * x
    for (k = n - 1; k != -1; k += -1) {
      for (var iteration = 0; iteration < itmax; iteration++) {
        // test f splitting
        var test_convergence = false
        for (l = k; l != -1; l += -1) {
          if (Math.abs(e[l]) <= prec) {
            test_convergence = true
            break
          }
          if (Math.abs(q[l - 1]) <= prec) break
        }
        if (!test_convergence) {
          // cancellation of e[l] if l>0
          c = 0.0
          s = 1.0
          var l1 = l - 1
          for (i = l; i < k + 1; i++) {
            f = s * e[i]
            e[i] = c * e[i]
            if (Math.abs(f) <= prec) break
            g = q[i]
            h = pythag(f, g)
            q[i] = h
            c = g / h
            s = -f / h
            for (j = 0; j < m; j++) {
              y = u[j][l1]
              z = u[j][i]
              u[j][l1] = y * c + z * s
              u[j][i] = -y * s + z * c
            }
          }
        }
        // test f convergence
        z = q[k]
        if (l == k) {
          //convergence
          if (z < 0.0) {
            //q[k] is made non-negative
            q[k] = -z
            for (j = 0; j < n; j++) v[j][k] = -v[j][k]
          }
          break //break out of iteration loop and move on to next k value
        }
        if (iteration >= itmax - 1) throw "Error: no convergence."
        // shift from bottom 2x2 minor
        x = q[l]
        y = q[k - 1]
        g = e[k - 1]
        h = e[k]
        f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y)
        g = pythag(f, 1.0)
        if (f < 0.0) f = ((x - z) * (x + z) + h * (y / (f - g) - h)) / x
        else f = ((x - z) * (x + z) + h * (y / (f + g) - h)) / x
        // next QR transformation
        c = 1.0
        s = 1.0
        for (i = l + 1; i < k + 1; i++) {
          g = e[i]
          y = q[i]
          h = s * g
          g = c * g
          z = pythag(f, h)
          e[i - 1] = z
          c = f / z
          s = h / z
          f = x * c + g * s
          g = -x * s + g * c
          h = y * s
          y = y * c
          for (j = 0; j < n; j++) {
            x = v[j][i - 1]
            z = v[j][i]
            v[j][i - 1] = x * c + z * s
            v[j][i] = -x * s + z * c
          }
          z = pythag(f, h)
          q[i - 1] = z
          c = f / z
          s = h / z
          f = c * g + s * y
          x = -s * g + c * y
          for (j = 0; j < m; j++) {
            y = u[j][i - 1]
            z = u[j][i]
            u[j][i - 1] = y * c + z * s
            u[j][i] = -y * s + z * c
          }
        }
        e[l] = 0.0
        e[k] = f
        q[k] = x
      }
    }

    for (i = 0; i < q.length; i++) if (q[i] < prec) q[i] = 0

    //sort eigenvalues
    for (i = 0; i < n; i++) {
      for (j = i - 1; j >= 0; j--) {
        if (q[j] < q[i]) {
          c = q[j]
          q[j] = q[i]
          q[i] = c
          for (k = 0; k < u.length; k++) {
            temp = u[k][i]
            u[k][i] = u[k][j]
            u[k][j] = temp
          }
          for (k = 0; k < v.length; k++) {
            temp = v[k][i]
            v[k][i] = v[k][j]
            v[k][j] = temp
          }
          i = j
        }
      }
    }

    return {
      U: u,
      S: q,
      V: v
    }
  }

  return {
    computeDeviationScores: computeDeviationScores,
    computeDeviationMatrix: computeDeviationMatrix,
    computeSVD: computeSVD,
    computePercentageExplained: computePercentageExplained,
    computeOriginalData: computeOriginalData,
    computeVarianceCovariance: computeVarianceCovariance,
    computeAdjustedData: computeAdjustedData,
    getEigenVectors: getEigenVectors,
    analyseTopResult: analyseTopResult,
    transpose: transpose,
    multiply: multiply,
    clone: clone,
    scale: scale
  }
})()

if (typeof module !== "undefined") module.exports = PCA
