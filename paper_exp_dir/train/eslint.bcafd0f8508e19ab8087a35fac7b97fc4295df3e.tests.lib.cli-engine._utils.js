
"use strict";

const path = require("path");
const vm = require("vm");
const { Volume, createFsFromVolume } = require("memfs");
const Proxyquire = require("proxyquire/lib/proxyquire");

const CascadingConfigArrayFactoryPath =
require.resolve("../../lib/cli-engine/cascading-config-array-factory");
const CLIEnginePath =
require.resolve("../../lib/cli-engine/cli-engine");
const ConfigArrayFactoryPath =
require.resolve("../../lib/cli-engine/config-array-factory");
const FileEnumeratorPath =
require.resolve("../../lib/cli-engine/file-enumerator");
const LoadRulesPath =
require.resolve("../../lib/cli-engine/load-rules");
const ESLintPath =
require.resolve("../../lib/eslint/eslint");
const ESLintAllPath =
